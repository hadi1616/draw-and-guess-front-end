import classes from './style.module.css';

const GlobalStyling = (props) => {

  const style = `${classes.container} ${props.className}`; // to make it more easy to design the web 

  return <div className={style}>{props.children}</div>;
};

export default GlobalStyling;
