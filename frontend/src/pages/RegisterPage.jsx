import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Регистрация</h1>
          <p className="py-6">Создайте аккаунт, чтобы начать отслеживать свой прогресс и получать поддержку.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Имя пользователя</span>
              </label>
              <input type="text" placeholder="имя пользователя" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="email" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Пароль</span>
              </label>
              <input type="password" placeholder="пароль" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Подтверждение пароля</span>
              </label>
              <input type="password" placeholder="подтверждение пароля" className="input input-bordered" />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Зарегистрироваться</button>
            </div>
            <div className="text-center mt-4">
              <p>Уже есть аккаунт? <Link to="/login" className="link link-primary">Войти</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 