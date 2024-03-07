import React, { useEffect, useState } from 'react';
import styles from './styles/TableRelationshipsPreview.module.scss'; // Import the SASS module
import { EdgeConnectionType } from '../typescript/api';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  array1: string[];
  array2: string[];
  onSelect?: (data: EdgeConnectionType) => void;
};

const TableRelationshipsPreview = ({ array1, array2, onSelect }: Props) => {
  const [activeTab, setActiveTab] = useState<EdgeConnectionType>('oneToMany');
  const paddedArray2 =
    array2.length >= array1.length
      ? array2
      : [...array2, ...Array(array1.length - array2.length).fill(null)];

  useEffect(() => {
    onSelect && onSelect(activeTab);
  }, [activeTab]);

  return (
    <>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === 'oneToMany' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('oneToMany')}
        >
          One to Many
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === 'oneToOne' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('oneToOne')}
        >
          One to One
        </button>
      </div>
      <div className={styles.scrollableTableContainer}>
        {activeTab === 'oneToMany' && (
          <table className={styles.table}>
            <tbody>
              {array1.flatMap((item, index) =>
                array2.map((subItem) => (
                  <tr key={uuidv4()} className={styles.tableRow}>
                    <td className={styles.tableCell}>{item}</td>
                    <td className={styles.tableCell}>{subItem}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'oneToOne' && (
          <table className={styles.table}>
            <tbody>
              {array1.map((item, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>{item}</td>
                  <td className={styles.tableCell}>{paddedArray2[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TableRelationshipsPreview;
