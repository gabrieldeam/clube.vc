import React, { useState } from 'react';
import styles from './Calendar.module.css';

interface CalendarRangeProps {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  onRangeChange: (start: Date | null, end: Date | null) => void;
}

const CalendarRangeComponent: React.FC<CalendarRangeProps> = ({
  selectedStartDate,
  selectedEndDate,
  onRangeChange
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Quantidade de dias no mês atual
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Índice do dia da semana do primeiro dia do mês (0 = Domingo, 1 = Segunda, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Cria um array com os dias, preenchendo os dias em branco no início
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (date: Date) => {
    // Se não houver data de início ou se já houver um intervalo completo,
    // inicia uma nova seleção (reinicia o range)
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      onRangeChange(date, null);
    } else {
      // Se já existe data de início, define a data final (se o dia clicado for igual ou posterior)
      if (date >= selectedStartDate) {
        onRangeChange(selectedStartDate, date);
      } else {
        // Se o dia clicado for anterior à data de início, reinicia a seleção
        onRangeChange(date, null);
      }
    }
  };

  // Verifica se o dia está no intervalo selecionado (excluso as bordas)
  const isInRange = (day: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return day > selectedStartDate && day < selectedEndDate;
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Cabeçalho com navegação de meses */}
      <div className={styles.header}>
        <button className={styles.navButton} onClick={prevMonth}>{"<"}</button>
        <div className={styles.monthYear}>
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </div>
        <button className={styles.navButton} onClick={nextMonth}>{">"}</button>
      </div>

      {/* Dias da semana */}
      <div className={styles.weekDays}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, idx) => (
          <div key={idx} className={styles.weekDay}>{day}</div>
        ))}
      </div>

      {/* Grid dos dias */}
      <div className={styles.daysGrid}>
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className={styles.day} />;
          }
          const isSelectedStart = selectedStartDate && day.toDateString() === selectedStartDate.toDateString();
          const isSelectedEnd = selectedEndDate && day.toDateString() === selectedEndDate.toDateString();
          const inRange = isInRange(day);
          return (
            <div
              key={index}
              className={`
                ${styles.day} 
                ${isSelectedStart || isSelectedEnd ? styles.selectedDay : ''} 
                ${inRange ? styles.inRangeDay : ''}
              `}
              onClick={() => handleDayClick(day)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarRangeComponent;
