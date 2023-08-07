import { Dispatch, useEffect, useState } from 'react';
import { FlexLayoutCmp, WebinyModel } from '../types';
import BootstrapForm from 'react-bootstrap/Form';
import { getModelsWebiny } from '../webinyApi';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getModels } from '../client';
import {
  GetTablesResponse,
  Table,
} from '../pontus-api/typescript-fetch-client-generated';

type Props = {
  setSelectedCmp: Dispatch<React.SetStateAction<FlexLayoutCmp | undefined>>;
};

const CmpPanel = ({ setSelectedCmp }: Props) => {
  const [tables, setTables] = useState<Table[]>();
  const { t, i18n } = useTranslation();

  const fetchModels = async () => {
    const data = await getModels();
    console.log(data.tables);
    setTables(data.tables);
    return data;
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="cmp-panel">
      <label className="cmp-panel__title">{t('add-component')}</label>
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
            {tables &&
              tables.map((table, index) => (
                <option key={index} value={JSON.stringify(table)}>
                  {table.name}
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
    </div>
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
