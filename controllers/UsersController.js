// Users Controller

class UsersController {
  static postNew(req, res) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    console.log(userEmail);
    console.log(userPassword);
  }
}

export default UsersController;
