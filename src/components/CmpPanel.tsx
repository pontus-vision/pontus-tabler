import { Dispatch, useEffect, useState } from 'react';
import { FlexLayoutCmp, WebinyModel } from '../types';
import BootstrapForm from 'react-bootstrap/Form';
import { getModels } from '../webinyApi';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

type Props = {
  setSelectedCmp: Dispatch<React.SetStateAction<FlexLayoutCmp | undefined>>;
};

const CmpPanel = ({ setSelectedCmp }: Props) => {
  const [models, setModels] = useState<WebinyModel[]>();
  const { t, i18n } = useTranslation();

  const fetchModels = async () => {
    const { data } = await getModels();
    const listModels = data.data.listContentModels.data;

    setModels(listModels);
    return data;
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <CmpPanelStyles>
      <div className="dropdown-panels">
        <div className="dropdown-panels__tables">
          {t('tables')}
          <BootstrapForm.Select
            onChange={(e) => {
              const cmp: FlexLayoutCmp = {
                componentName: 'PVGridWebiny2',
                cmp: JSON.parse(e.target.value),
              };
              setSelectedCmp(cmp);
            }}
            defaultValue={'option'}
          >
            <option value="option"></option>
            {models &&
              models.map((model, index) => (
                <option key={index} value={JSON.stringify(model)}>
                  {model.name}
                </option>
              ))}
          </BootstrapForm.Select>
        </div>
        <div className="dropdown-panels__charts">
          {t('graphics')}
          <BootstrapForm.Select
            onChange={(e) => {
              const cmp: FlexLayoutCmp = {
                componentName: 'PVDoughnutChart2',
              };
              setSelectedCmp(cmp);
            }}
          >
            <option></option>
            <option>{t('donut-chart')}</option>
          </BootstrapForm.Select>
        </div>
      </div>
    </CmpPanelStyles>
  );
};

const CmpPanelStyles = styled.div`
  .dropdown-panels {
    display: flex;
    gap: 1rem;

    &__tables {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__charts {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

export default CmpPanel;
