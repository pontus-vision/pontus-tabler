import Button from 'react-bootstrap/Button';
import BootstrapForm from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const Form = () => {
  const data = useParams()

 useEffect(()=>{
    console.log({data})
  },[data])

 return (
  <BootstrapForm>
      <fieldset disabled>
        <BootstrapForm.Group className="mb-3">
          <BootstrapForm.Label htmlFor="disabledTextInput">Disabled input</BootstrapForm.Label>
          <BootstrapForm.Control id="disabledTextInput" placeholder="Disabled input" />
        </BootstrapForm.Group>
        <BootstrapForm.Group className="mb-3">
          <BootstrapForm.Label htmlFor="disabledSelect">Disabled select menu</BootstrapForm.Label>
          <BootstrapForm.Select id="disabledSelect">
            <option>Disabled select</option>
          </BootstrapForm.Select>
        </BootstrapForm.Group>
        <BootstrapForm.Group className="mb-3">
          <BootstrapForm.Check
            type="checkbox"
            id="disabledFieldsetCheck"
            label="Can't check this"
          />
        </BootstrapForm.Group>
        <Button type="submit">Submit</Button>
      </fieldset>
    </BootstrapForm>
 )
}

export default Form
