import "./footer.css";

function FooterBase({
    text = "© Cloudstry Tech. All rights reserved.",
    className = "",
}) {
    return (
        <footer className={`cst-footer ${className}`}>
            <p className="cst-footer-text">{text}</p>
        </footer>
    );
}

export default FooterBase;
