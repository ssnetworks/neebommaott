import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} NEE BOMMA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
