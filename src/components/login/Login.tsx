import React, { useState, FormEvent } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import LoginIcon from '@mui/icons-material/Login'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  name : string
}

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login = (props : LoginProps) => {
  const navigate = useNavigate();

  const [values, setValues] = useState<{
    errVisible: boolean;
    userName: string;
  }>({
    errVisible: false,
    userName: '',
  });

  const handleChange = (prop: keyof typeof values) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const logIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserObj(values.userName);
    console.log('logged in');
  };

  const setUserObj = async (SoldierID: string) => {
    await fetch(`//Url here... ${SoldierID}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        var resUser : boolean | User = data

        if (resUser) {
          props.onLogin(resUser as User);
          navigate(`/`);
        } else {
          setValues({ ...values, errVisible: true });
        }
      });
  };

  return (
    <center>
      <Card style={cardStyle} sx={{ minWidth: 100 }}>
        <form style={gridStyle} onSubmit={logIn}>
          <div style={{ justifySelf: 'end' }}>
            <Link to="/">
              {' '}
              <LoginIcon style={{ color: 'red', fontSize: 22 }} />
            </Link>
          </div>
          <CardContent>
            <h3>הזן מספר אישי</h3>
            <FormControl sx={{ m: 1, width: '50ch' }} variant="filled">
              <InputLabel htmlFor="filled-adornment">מספר אישי</InputLabel>
              <FilledInput
                id="filled-adornment"
                type="number"
                value={values.userName}
                onChange={handleChange('userName')}
                endAdornment={
                  <InputAdornment position="end">
                    <AccountCircle />
                  </InputAdornment>
                }
              />
            </FormControl>
          </CardContent>
          {values.errVisible && (
            <p
              style={{
                marginTop: -20,
                color: 'red',
              }}
            >
              מספר אישי לא קיים במאגר
            </p>
          )}
          <Button
            style={{ width: 300, backgroundColor: '#292929' }}
            type="submit"
            size="large"
            variant="contained"
            disabled={false}
          >
            התחבר
          </Button>

          <div
            style={{
              marginTop: 20,
              display: 'grid',
              gridTemplateColumns: '1fr 0.5fr 1fr',
            }}
          >
          </div>
        </form>
      </Card>
    </center>
  );
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
};

const cardStyle: React.CSSProperties = {
  marginTop: 20,
  width: 600,
  padding: 10,
};

export default Login;
