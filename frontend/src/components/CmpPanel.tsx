import { Dispatch, useEffect, useState } from 'react';
import { FlexLayoutCmp, WebinyModel } from '../types';
import BootstrapForm from 'react-bootstrap/Form';
import { getModelsWebiny } from '../webinyApi';
import { useTranslation } from 'react-i18next';
import { getTables } from '../client';
import { TableRef } from '../pontus-api/typescript-fetch-client-generated';

type Props = {
  setSelectedCmp: Dispatch<React.SetStateAction<FlexLayoutCmp | undefined>>;
};

const CmpPanel = ({ setSelectedCmp }: Props) => {
  const [tables, setTables] = useState<TableRef[]>();
  const { t, i18n } = useTranslation();

  const fetchModels = async () => {
    const res = await getTables();

    const data = res?.data;
    if (!data) return;
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
            data-cy="cmp-panel-select-tables"
            onChange={(e) => {
              const table = tables.find(table => table.name === e.target.value)

              const cmp: FlexLayoutCmp = {
                componentName: 'PVGridWebiny2',
                cmp: table,
              };
              setSelectedCmp(cmp);
            }}
            defaultValue={'option'}
          >
            <option value="option"></option>
            {tables &&
              tables.map((table, index) => (
                <option key={index} value={table.name}>
                  {table.label}
                </option>
              ))}
          </BootstrapForm.Select>
        </div>
        <div className="dropdown-panels__charts">
          {t('graphics')}
          <BootstrapForm.Select
            data-cy="cmp-panel-select-graphics"
            onChange={(e) => {
              const cmp: FlexLayoutCmp = {
                componentName: 'PVDoughnutChart2',
              };
              setSelectedCmp(cmp);
            }}
          >
            <option></option>
            <option value="donut-chart">{t('donut-chart')}</option>
          </BootstrapForm.Select>
        </div>
      </div>
    </div>
  );
};

export default CmpPanel;
