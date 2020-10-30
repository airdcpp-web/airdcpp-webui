//@ts-ignore
import template from 'tcomb-form-templates-semantic';


template.list.renderRow = (row: any, locals: any) => {
  return (
    <div key={row.key} className="ui grid">
      <div className="eight wide column">{row.input}</div>
      <div className="eight wide column">{template.list.renderButtonGroup(row.buttons, locals)}</div>
    </div>
  );
};

export default template; 
