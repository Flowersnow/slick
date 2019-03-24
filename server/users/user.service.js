const {
    Pool,
} = require("pg");
const bcrypt = require("bcrypt");

const config = require("config.json");
const jwt = require("jsonwebtoken");

const {
    user,
    host,
    database,
    password,
    port
} = require("_helpers/config.js");

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
    ssl: false,
    max: 10,
    connectionTimeoutMillis: 10000, // return an error after 10 second if connection could not be established
})

module.exports = {
    authenticate,
    create,
    update,
    delete: _delete
};

async function performQuery(q) {
    const client = await pool.connect();
    let res;
    try {
        await client.query("BEGIN");
        try {
            res = await client.query(q);
            await client.query("COMMIT");
        } catch (err) {
            console.log(err.stack);
            await client.query("ROLLBACK");
            throw err;
        }
    } finally {
        client.release();
    }
    return res;
}

async function authenticate(input) {
    let username, password, adminstatus;
    if (input.hasOwnProperty("username") && input.hasOwnProperty("password") && input.hasOwnProperty("adminstatus")) {
        username = input.username;
        password = input.password;
        adminstatus = input.adminstatus;
    } else {
        throw "Username or password was not supplied in body";
    }
    console.log(username, password, adminstatus);
    let adminText = 'SELECT users.userid, fullname, password from users, admin where users.email=($1) and (admin.userid = users.userid)';
    let nonAdminText = 'SELECT userid, fullname, password from users where email=($1)';
    let text = adminstatus ? adminText : nonAdminText;
    const query = {
        text: text,
        values: [username]
    };
    try {
        let result = await performQuery(query);
        console.log(result.rows);
        if (!result || result.rowCount < 1) {
            if (adminstatus) {
                throw "Username not found as admin";
            } else {
                throw "Username not found";
            }
        } else {
            //   console.log(result.rows[0]);
            let resPassword = result.rows[0].password;
            let resId = result.rows[0].userid;
            let resFullname = result.rows[0].fullname;
            console.log(resFullname);
            let resEmail = result.rows[0].email;
            let {
                firstname,
                lastname
            } = getFirstandLastNames(resFullname);

            try {
                let res = await bcrypt.compare(password, resPassword);
                if (res === true) {
                    console.log("Check correct");
                    const token = jwt.sign({
                        sub: resId
                    }, config.secret);
                    //replace config.secret
                    return {
                        username: resEmail,
                        token: token,
                        firstName: firstname,
                        resLastname: lastname
                    };
                } else {
                    let error2 = "Username or password is incorrect";
                    throw error2;
                }
            } catch (err) {
                // error with awaiting comparing passwords
                throw err;
            }
        }
    } catch (err) {
        // server side error dealing with DB
        throw err;
    }
}

function getFirstandLastNames(fullname) {
    let res = fullname.split(" "); // split fullname where space occurs
    return {
        firstname: res[0],
        lastname: res[1]
    };
}
async function create(input) {
    console.log(input);
    let hasAllProps =
        input.hasOwnProperty("firstName") &&
        input.hasOwnProperty("lastName") &&
        input.hasOwnProperty("password") &&
        input.hasOwnProperty("username") &&
        input.hasOwnProperty("adminstatus") &&
        input.hasOwnProperty("description");
    let firstname, lastname, username, password, adminstatus, description;
    if (hasAllProps) {
        firstname = input.firstName;
        lastname = input.lastName;
        password = input.password;
        username = input.username;
        adminstatus = input.adminstatus;
        description = input.description;
    } else {
        throw "Body does not contain all required fields to create a new user";
    }
    // validate
    const query = {
        name: "get-username",
        text: "SELECT email from users where email=($1)",
        values: [username]
    };
    try {
        let response = await performQuery(query);
        if (response && response.rowCount >= 1) {
            throw "Username " + response.rows[0].email + " is already taken";
        }
        // other create the new user
        // hash password (password must not be null (empty string))
        if (password) {
            let maxID = await getMaxUserid();
            let newUserid = createUID(maxID);
            let adminText = "insert into admin VALUES(($1), NOW())"
            let fullname = firstname + " " + lastname;
            let encrpytPass = bcrypt.hashSync(password, 10);
            const query = {
                name: "create-users",
                text: "insert into users VALUES(($1), ($2), ($3), ($4), ($5), ($6))",
                values: [newUserid, fullname, description, username, "active", encrpytPass]
            };
            const queryFullname = {
                name: "insert-fullname",
                text: "insert into fullname VALUES(($1), ($2), ($3))",
                values: [fullname, firstname, lastname]
            }
            const adminQuery = {
                name: "create-adminuser",
                text: adminText,
                values: [newUserid]
            };

            if (adminstatus) {
                let response;
                try {
                    response = await performQuery(queryFullname);
                } catch (err) {
                    console.log("fullname already exists");
                    response = err.code === "23505" ? true : false; // neglect error if it is a duplicate key violation

                }
                let response1 = await performQuery(query);
                let response2 = await performQuery(adminQuery);
                let isValidRes = response && response1 && response2 && response1.rowCount >= 1 && response2.rowCount >= 1;
                if (isValidRes) {
                    return true;
                } else {
                    throw "Cannot create new Admin user. Please try again";
                }
            } else {
                let response;
                try {
                    response = await performQuery(queryFullname);
                } catch (err) {
                    console.log("fullname already exists");
                    response = err.code === "23505" ? true : false; // neglect error if it is a duplicate key violation
                }
                let response1 = await performQuery(query);
                if (response && response1 && response1.rowCount >= 1) {
                    return true;
                } else {
                    throw "Cannot create new User. Please try again";
                }
            }
        } else {
            throw "Please enter a different Password. Empty passwords are not allowed";
        }
    } catch (err) {
        throw err;
    }
}
async function getMaxUserid() {
    const query = {
        name: "get-userid",
        text: "SELECT userid from users"
    };
    try {
        let res = await performQuery(query);

        if (res && res.rowCount < 1) {
            throw "Something went wrong with querying DB";
        }

        let maxID = extractUID(res.rows[0].userid);
        for (let i of res.rows) {
            let extractedIndex = extractUID(i.userid);
            maxID = extractedIndex > maxID ? extractedIndex : maxID;
        }

        return maxID;
    } catch (err) {
        throw err;
    }
}

function createUID(maxID) {
    let num = maxID + 1;
    return "U" + num;
}

function extractUID(userid) {
    let uIndex = userid.indexOf("U");
    let id = userid.slice(uIndex + 1);
    return parseInt(id, 10);
}

async function update(username, userParam) {
    let containsKeys =
        username &&
        userParam.hasOwnProperty("oldpassword") &&
        userParam.hasOwnProperty("newpassword");
    let oldpass, newpass;
    if (containsKeys) {
        oldpass = userParam.oldpassword;
        newpass = userParam.newpassword;
    } else {
        throw "Request does not contain correct parameters";
    }
    const query = {
        name: "get-username",
        text: "SELECT password, email from users where email=($1)",
        values: [username]
    };
    try {
        let response = await performQuery(query);
        if (response && response.rowCount < 1) {
            throw "Username " +
                username +
                " not found. Please sign up and create a new user";
        }
        let resPassword = response.rows[0].password;
        let isPassMatch = await bcrypt.compare(oldpass, resPassword);
        if (isPassMatch) {
            let encryptNewPass = await bcrypt.hashSync(newpass, 10);
            const query = {
                name: "update-user",
                text: "update users set password=($1) where email=($2)",
                values: [encryptNewPass, username]
            };
            let res = await performQuery(query);
            if (res && res.rowCount >= 1) {
                return true;
            } else {
                throw "Error: Unable to update password for user " +
                    username +
                    ". Please try again.";
            }
        } else {
            throw "Error: old password is incorrect for user " + username;
        }
    } catch (err) {
        throw err;
    }
}

async function _delete(id) {
    if (!username) {
        throw "body does not contain correct parameters";
    }
    try {
        const query = {
            name: "delete-user",
            text: "delete from users where id=($1)",
            values: [id]
        };
        let res = await performQuery(query);
        if (res && res.rowCount >= 1) {
            return true;
        } else {
            throw "Unable to delete user. User not found";
        }
    } catch (err) {
        throw err;
    }
}