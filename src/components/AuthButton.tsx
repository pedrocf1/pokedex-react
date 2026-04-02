import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const UserName = styled.span`
  font-size: 0.875rem;
  color: #cbd5e1;
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b91c1c;
  }
`

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #404854;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px solid #475569;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #334155;
  }
`

const GithubIcon = styled.svg`
  width: 1rem;
  height: 1rem;
`

export function AuthButton() {
  const { user, isAuthenticated, loginWithGithub, logout } = useAuth()

  if (isAuthenticated && user) {
    return (
      <UserContainer>
        <UserName>{user.fullName}</UserName>
        <LogoutButton onClick={logout}>
          Logout
        </LogoutButton>
      </UserContainer>
    )
  }

  return (
    <LoginButton onClick={loginWithGithub}>
      <GithubIcon viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </GithubIcon>
      Login with GitHub
    </LoginButton>
  )
}
