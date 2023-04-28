import './button.css';

const Button = ({ children, className, onClick, type = 'button' }) => {
    return (
        <button className={`${className} btn`} onClick={onClick} type={type}>
            {children}
        </button>
    );
};
export default Button;
