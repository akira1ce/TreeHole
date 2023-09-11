import { getRandomInteger } from '@/utils/getRandomInteger';
import { Button, Row, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'umi';
import MenusModal from './components/MenusModal';
import style from './index.less';

const sourceMenus = JSON.parse(localStorage.getItem('menus') || '[]');

interface IMenu {
  id: number;
  index: number;
  top: number;
  left: number;
  fontSize: number;
}

const EatWhat: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState<string[]>(sourceMenus);
  const floatMenus = useRef<IMenu[]>([]);
  const [times, setTimes] = useState(1);
  const isTimesOver = times > 4;

  const floatMenu = floatMenus.current.map((item) => {
    return (
      <span
        className={style.container__float}
        key={item.id}
        style={{
          position: 'absolute',
          top: item.top + 'px',
          left: item.left + 'px',
          fontSize: item.fontSize + 'px',
        }}
      >
        {menus[item.index]}
      </span>
    );
  });

  function handleStart() {
    !isTimesOver && setOpen(!open);
    !open && setTimes(times + 1);
  }

  function handleUpdateMenus(menus: string[]) {
    setMenus(menus);
  }

  useEffect(() => {
    let currentInterval: NodeJS.Timeout;
    let floatMenusInterval: NodeJS.Timeout;
    let k = 0;

    if (open && !isTimesOver) {
      /** current menu */
      currentInterval = setInterval(() => {
        setCurrent(getRandomInteger(0, menus.length));
      }, 100);

      /** float menu */
      floatMenusInterval = setInterval(() => {
        if (floatMenus.current.length > 10) floatMenus.current = floatMenus.current.slice(-10);
        floatMenus.current.push({
          id: Date.now(),
          index: getRandomInteger(0, menus.length),
          top: getRandomInteger(56, 960),
          left: getRandomInteger(240, 1080),
          fontSize: getRandomInteger(10, 55),
        });
      }, 100);
    }

    return () => {
      clearInterval(currentInterval);
      clearInterval(floatMenusInterval);
    };
  }, [open]);

  useEffect(() => {
    localStorage.setItem('menus', JSON.stringify(menus));
  }, [menus]);
  return (
    <Row justify="center" align="middle" className={style.container}>
      {floatMenu}
      <Space direction="vertical" align="center">
        <Tooltip title={isTimesOver ? '重头再来!' : '就这个了!'}>
          <h2
            style={{ cursor: 'pointer' }}
            onClick={() => {
              isTimesOver && setTimes(1);
            }}
          >
            {!isTimesOver ? menus[current] : '你别吃了😒'}
          </h2>
        </Tooltip>
        <Space>
          {!isTimesOver && <MenusModal menus={menus} handleUpdateMenus={handleUpdateMenus} isOpen={open} />}
          {!isTimesOver && (
            <Button type="primary" onClick={handleStart} disabled={isTimesOver}>
              {times == 1 ? 'Start' : open ? 'Stop' : 'No Next'}
            </Button>
          )}
        </Space>
      </Space>
    </Row>
  );
};

export default EatWhat;
