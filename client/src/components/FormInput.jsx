
function FormInput(props) {
  return (
    <div className="form-group">
      <label>{props.label}</label>

      <input
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        className={props.error ? 'input-error' : ''}
      />

      {props.error && (
        <p className="error-message">{props.error}</p>
      )}
    </div>
  );
}

export default FormInput;
