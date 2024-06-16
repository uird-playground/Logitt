import url from "url";

export const parseQuery = (req: any) => {
  return new Promise<any>((resolve, _reject) => {
    var queryData = url.parse(req.url, true).query;
    resolve({ ...queryData });
  });
};

export const userHaveAccess = (body: any) => {
  return new Promise<boolean>(async (resolve, reject) => {
    if (body.username != process.env.LOGITT_USERNAME) {
      reject("Username is incorrect");
      return;
    }
    if (body.password != process.env.LOGITT_PASSWORD) {
      reject("Password is incorrect");
      return;
    }
    resolve(true);
  });
};
