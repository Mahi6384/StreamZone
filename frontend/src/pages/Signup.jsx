import React from "react";
import AuthForm from "../components/AuthForm";
function Signup() {
  return (
    <div>
      <AuthForm
        title="Create Account"
        buttonText="Create Account"
        showName={true}
      />
    </div>
  );
}

export default Signup;
