import React, { useState } from 'react';
import { Box, TextInput, Button } from 'grommet'

export interface AuthAttempt {
    username?: string;
    password?: string;
}

export interface AuthResult {
    error?: string;
    success?: boolean;
    token?: string;
}

export interface LoginFormProps {
    onSubmit?: (attempt: AuthAttempt) => AuthResult
}

export const LoginForm: React.FC<LoginFormProps> = (props) => {
    const [ authAttempt, setAuth ] = useState<AuthAttempt>({})
    
    const onSubmit = () => {
        props.onSubmit?.(authAttempt)
    }

    return (
        <Box
            round="xsmall"
            background="light-1"
            elevation="1"
            pad="medium"
        >
            <TextInput 
                value={authAttempt.username}
                onChange={(e) => setAuth({...authAttempt, username: e.target.value})}
                placeholder="Username" />
            <TextInput 
                type="password"
                value={authAttempt.password}
                onChange={(e) => setAuth({...authAttempt, password: e.target.value})}
                placeholder="Password" />
            <Button
                onClick={onSubmit}
                label="Login" />
        </Box>
    )
}