import React, { useState } from 'react';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    console.log('Username:', username);
    console.log('Password:', password);

  };

  return (
        <div className=' bg-green-100 w-72 h-90 justify-self-center'>
        <h2 className='text-3xl pt-10 pb-12'>Login</h2>
        <form onSubmit={handleLogin}>
            <div>
            <input
            className='mt-5 mb-5 bg-green-50 rounded-sm indent-3'
                type="text"
                id="username"
                placeholder='Usuário'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div>
            <input
                className='mt-5 mb-10 bg-green-50 rounded-sm indent-3'
                type="password"
                id="password"
                placeholder='Senha'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit" 
            className="bg-emerald-600 shadow-lg rounded-sm w-20 h-12 
            items-center"
            >Login</button>
        </form>
        </div>
  );
};

export default Login;