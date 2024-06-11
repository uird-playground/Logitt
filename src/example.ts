import consola from "consola";

const { Logitt } = require("./");
const http = require("http");

const loggy = new Logitt({ trace: true });

http.createServer(loggy.render).listen(5000, () => {
  consola.start("Server is running on port " + 5000 + " ...\n");
  // logging examples
  // loggy.warn("The user is trying to create an already existing session");
  // loggy.error("The data recieved is not valid", {
  //   data: {
  //     userId: "1321421353",
  //     email: "ob.mokhfi@gmail.com",
  //     phone: "0666235548",
  //   },
  // });
  // loggy.success("User was created successfully", { userId: "1321421353" });
  // loggy.debug("This is a debug message");
});
