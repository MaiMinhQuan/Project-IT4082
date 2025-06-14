import React, { useState } from 'react';
import { IpcRendererEvent } from 'electron';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert, Button } from 'react-bootstrap';
import { FaLock, FaUser, FaEyeSlash } from 'react-icons/fa';
import AnimatedFrame from '../../utils/animation_page';
import { IpcResponse, HandleLoginState } from '../../../Back-end/interface/interface';
import './LoginForm.css';

function LoginForm({ onAction }: HandleLoginState) {
  const [input, setInput] = useState({
    username: '',
    password: '',
    admin: false,
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prevInput) => ({
      ...prevInput,
      admin: event.target.checked,
    }));
  };

  const handleListener = () => {
    window.electronAPI.clearListener('login-response');
    window.electronAPI.onMessage(
      'login-response',
      (event: IpcRendererEvent, response: IpcResponse) => {
        if (response.success) {
          setMessage('Login successful');
          onAction(true);
          if (response.message === 'Admin successful')
            navigate('/manage-account');
          else navigate('/home');
        } else {
          setMessage(response.message);
        }
        setIsLoading(false);
      },
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    handleListener();
    await window.electronAPI.login({
      username: input.username,
      password: input.password,
      admin: input.admin,
    });
  };

  const handleToggle = () => {
    const inputNode = document.getElementById('myPassword') as HTMLInputElement;
    if (inputNode.type === 'password') inputNode.type = 'text';
    else inputNode.type = 'password';
  };

  return (
    <AnimatedFrame>
      <div className="login-container">
        <img
          src="/assets/icons/logo1.png"
          alt="Logo"
          className="welcome-image"
        />
        {/* <div className="welcome-text">
          CHÀO MỪNG BẠN ĐẾN VỚI CHUNG CƯ BLUE MOON
        </div> */}
        <div className="wrapper login">
          <form onSubmit={handleSubmit}>
            <h1>Đăng nhập</h1>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                required
                value={input.username}
                onChange={handleChange}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                id="myPassword"
                placeholder="Mật khẩu"
                required
                value={input.password}
                onChange={handleChange}
              />
              <div className="icon">
                <FaEyeSlash className="icon-left" onClick={handleToggle} />
                <FaLock />
              </div>
            </div>

            <div className="remember-forgot">
              <label htmlFor="myCheckbox">
                <input
                  type="checkbox"
                  id="myCheckbox"
                  checked={input.admin}
                  onChange={handleCheckboxChange}
                  aria-label="Đăng nhập với tư cách quản trị viên"
                />
                Đăng nhập với tư cách quản trị viên
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Đang đăng nhập...</span>
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
          {message && (
            <Alert key="warning" variant="warning">
              {message}
            </Alert>
          )}
        </div>
      </div>
    </AnimatedFrame>
  );
}

export default LoginForm;
