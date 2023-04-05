/* eslint-disable no-param-reassign */
import { OBS_SCENE_NAME, OBS_SOURCE_NAME_MAIN, OBS_SOURCE_NAME_SECONDARY } from '../constants';
import { useObsCtx } from '../contexts/obsCtx';
import asyncSleep from '../utils/async';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export default function useSourceObs() {
  const name = OBS_SCENE_NAME;
  const [itemsIndex] = useState<Record<any, any>>({});
  const [currentItemId, setCurrentItemId] = useState<number>();

  const {
    obsClient, setAllSource,
    allSource,
    setLoadingSwitch,
    setSelectedSource,
    selectedSource,
  } = useObsCtx();

  async function refreshItems() {
    const data: any = await obsClient?.call('GetSceneItemList', { sceneName: name }) ?? {};
    const newItem = data.sceneItems || allSource;
    if (!selectedSource.sceneItemId) {
      setSelectedSource(data.sceneItems?.[0]);
    }
    setAllSource(newItem);
    for (let i = 0; i < newItem.length; i++) {
      const item = newItem[i];
      itemsIndex[item.sceneItemId as any] = i;
      if (item.sceneItemEnabled) {
        setCurrentItemId(item?.sceneItemId as number);
      }
    }
  }

  useEffect(() => {
    obsClient?.on?.('SceneItemEnableStateChanged', async (data) => {

    });
    obsClient?.on?.('SceneItemListReindexed', async (data) => {
      if (data.sceneName === name) {
        await refreshItems();
      }
    });
    obsClient?.on?.('SceneItemCreated', async (data) => {
      if (data.sceneName === name) {
        await refreshItems();
      }
    });
    obsClient?.on?.('SceneItemRemoved', async (data) => {
      if (data.sceneName === name) {
        await refreshItems();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSource, obsClient]);

  // eslint-disable-next-line no-undef
  const onSwitchSource = async (sourceName: LiteralUnion<typeof OBS_SOURCE_NAME_SECONDARY | typeof OBS_SOURCE_NAME_MAIN, string> = '') => {
    const newSourceName = sourceName?.toLowerCase();

    if (newSourceName) {
      const sourceData = allSource.find((sc) => sc?.sourceName?.toLowerCase().includes(newSourceName));
      console.log('sourceData', sourceData);
      const itemId = sourceData?.sceneItemId;

      if (obsClient && itemId) {
        setLoadingSwitch(true);
        if (allSource.length > 2) {
          message.error('OBS Source not allow more than 2');
          return;
        }
        try {
          await obsClient.call('SetSceneItemEnabled', {
            sceneName: name,
            sceneItemId: itemId,
            sceneItemEnabled: true,
          });
        } catch (error) {
          setLoadingSwitch(false);
          throw new Error(`OBS client error: ${error}`);
        }
        if (currentItemId !== itemId) {
          try {
            await obsClient.call('SetSceneItemEnabled', {
              sceneName: name,
              sceneItemId: currentItemId!,
              sceneItemEnabled: false,

            });
          } catch (error) {
            throw new Error(`OBS client error: ${error}`);
          }
        }
        setCurrentItemId(itemId);

        // updatedSource to change sceneItemEnabled
        const updatedSource = allSource.map((item) => {
          item.sceneItemEnabled = item.sceneItemId === sourceData.sceneItemId;
          return item;
        });

        // delay 3sc
        await asyncSleep(3000);
        setLoadingSwitch(false);
        setAllSource(updatedSource);

        setSelectedSource(sourceData);
      } else {
        console.error('OBS sourceID not found');
      }
    }
  };

  useEffect(() => {
    (() => {
      refreshItems();
    })();
  }, [obsClient]);

  return {
    onSwitchSource,
  };
}
