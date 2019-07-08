import React, { Component } from "react";

export class Login extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: ""
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitLogin = () => {
    // submit login
  };

  render() {
    return (
      <View>
        <h1>Login</h1>
        <hr />
        <form
        >
          <div>
            <label htmlFor="emailField">
              Email
            </label>
            <div >
              <input
                id="emailField"
                type="text"
                placeholder="Email"
                name="email"
                onChange={this.onChange}
                value={this.state.email}
              />
            </div>
            <label htmlFor="passwordField">
              Password
            </label>
            <div >
              <input
                id="passwordField"
                name="password"
                type="password"
                placeholder="Password"
                onChange={this.onChange}
                value={this.state.password}
              />
            </div>
            <div >
              <button
                type="button"
                onClick={this.submitLogin}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </View >
    );
  }
}
