import styles from '@/styles/billionaire.module.css';

export default function ResultRender(winningNumber = {}) {
  const {
    N1, N2, N3, N4, N5, NS, type, fetchFail,
  } = winningNumber;

  if (!fetchFail) {
    return (
      <div>
        { type }
        {' '}
        result is
        <div className={styles['result-container']}>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N1 }</span>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N2 }</span>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N3 }</span>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N4 }</span>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N5 }</span>
          <span className={`${styles['regular-balls']} ${styles['special-ball']}`}>{ NS }</span>
        </div>
      </div>
    );
  }
}
