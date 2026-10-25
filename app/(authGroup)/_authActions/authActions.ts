"use server";

export type LoginState = {
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      avatar: string;
      role: "LANDLORD" | "TENANT" | "ADMIN";
      status: "ACTIVE" | "BLOCKED";
      createdAt: string;
      updatedAt: string;
    };
    accessToken: string;
  };
};



export const loginAction = async (prevState: LoginState, formData: FormData) => {

    const email = formData.get("email")
    const password = formData.get("password")

    const payload = {email, password}


    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, 
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(payload)
        })

    const result = await res.json()

    console.log(result, "RESult");

//? sample output of result 
//     {
//   message: 'user logged in successfully',
//   data: {
//     user: {
//       id: 'dd01d503-7934-4a91-b95a-59e69c0fcfa1',
//       name: 'Mr TENANT ',
//       email: 'tenant@yz.com',
//       phone: '01912345678',
//       avatar: 'www.google.com',
//       role: 'TENANT',
//       status: 'ACTIVE',
//       createdAt: '2026-10-08T09:42:43.893Z',
//       updatedAt: '2026-10-08T09:42:43.893Z'
//     },
//     accessToken: ''
//   }
    

    return result
    
    
};
