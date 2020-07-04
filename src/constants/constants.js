const INVALIDUSER = 'Invalid User';
const INVALIDPASSWORD = 'Invalid Password';
const PASSWORDSMISMATCH = 'Passwords need to match';
const USERNAMEEXISTS = 'Username already exists';
const EMAILUSED = 'This email is already used by a different user';

const NAV = [
  { link: '/books?page=1', title: 'Books' },
  { link: '/authors', title: 'Authors' },
  { link: '/profile', title: 'Profile' },
  { link: '/admin', title: 'Admin Panel' },
];

module.exports = {
  INVALIDUSER,
  INVALIDPASSWORD,
  NAV,
  PASSWORDSMISMATCH,
  USERNAMEEXISTS,
  EMAILUSED,
};
