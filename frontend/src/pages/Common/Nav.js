import React, { useState } from 'react'
import { styled } from 'styled-components'

const Nav = () => {
    const [show, setShow] = useState("true");

    return (
        <NavWrapper show={show}>
            <Logo>
                <img
                    src=""
                    alt="주경야학 Logo"
                    onClick={() => (window.location.href = "/governmentmain")} />
            </Logo>

            <Login>Login</Login>

        </NavWrapper>
    )
}

export default Nav

const Login = styled.a`
    background-color: rgba(0,0,0,0.6);
    padding: 8px 16px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    border: 1px solid #f9f9f9;
    transition: all 0.2s ease 0s;

    &:hover {
    background-color: #f9f9f9;
    color: gray;
    border-color: transparent;
    }
`

const NavWrapper = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background-color: #fff;  // props를 if문으로 해둔거임 "transparent"투명한!!
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 36px;
    letter-spacing: 16px;
    z-index: 3;
`;

const Logo = styled.a`
    padding: 0;
    width: 80px;
    margin-top: 4px;
    max-height: 70px;
    font-size: 0;
    display: inline-block;
    img {
        width: 100%;
        display: block;
    }
`