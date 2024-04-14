import styles from './header.module.css'

function Header() {
  return (
    <div
      className={styles.navbar}
    >
      <h6
      className={styles.heading}
      onClick={() => window.location.reload()}
    >
      DNS DASHBOARD
    </h6>
    </div>
  );
}

export default Header;
