import { theme } from 'antd';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Webcam from 'react-webcam';
import useCameraArray from '../hooks/useCameraArray';

function CameraArrayCard({
  isShowPlayerCame,
  width = 640,
}: {
  cameras?: any[];
  isShowPlayerCame: any;
  width?: any;
}) {
  const { cameraArray, setCameraArray, getSelectDevice } = useCameraArray();
  const [allCamera, setAllCamera] = useState(cameraArray);

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;

    const items = Array.from(cameraArray);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCameraArray(items);
    setAllCamera(items);
    console.log('items', items);
  }
  const { token } = theme.useToken();

  const webcamConfig = {
    audio: false,
    screenshotFormat: 'image/jpeg',
    screenshotQuality: 1,
    style: {
      borderRadius: token.borderRadiusSM,
      marginTop: token.marginMD,
      position: isShowPlayerCame ? 'relative' : 'absolute',
      visibility: isShowPlayerCame ? 'visible' : 'hidden',
      width,
    },
  } as Webcam['props'];

  console.log('sdds', allCamera);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="characters">
        {(provided: any) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              position: isShowPlayerCame ? 'relative' : 'absolute',
              visibility: isShowPlayerCame ? 'visible' : 'hidden',
            }}
          >
            {allCamera.map(({ deviceId, ref, label }, index) => {
              console.log('ref', ref);

              return (
                <Draggable key={deviceId} draggableId={deviceId} index={index}>
                  {(provided: any) => (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignContent: 'center',
                      }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {index === 0
                        ? 'Backer'
                        : index > 3
                        ? 'Other'
                        : `Player${index}`}
                      <Webcam
                        key={index}
                        ref={ref}
                        {...webcamConfig}
                        videoConstraints={{
                          deviceId,
                        }}
                      />
                      {label}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default CameraArrayCard;
