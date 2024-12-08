const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-legal">
                <h3>Legal</h3>
                <ul>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                    <li><a href="/cookies">Cookie Policy</a></li>
                    {/* For coaches only */}
                    <li><a href="/coach-agreement">Coach Agreement</a></li>
                </ul>
            </div>
            {/* ... rest of footer content ... */}
        </footer>
    );
}; 