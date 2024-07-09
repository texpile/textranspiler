// deep_drive_prototype_v4.h
/////////////////////////////////
#ifdef DEEP_DIVE_PROTOTYPE_V4_H
#define DEEP_DIVE_PROTOTYPE_V4_H
#include <map>
#include "helios_signal.h"
namespace Hollow
{
    class DeepDivePrototypeV4:public DeepDiveBase
    {
        private:
            HELIOS::BangbooHandle m_handle;
            NChessboardMap<EHDomainType, EHSensorType> m_crossDomainSensorMap;
            MsensorContainer<VisualSensor> m_visualSensorContainer;
        public:
            virtual void RegisterBangbooHandle(HollowSignal signal) override;
            HCRESULT SyncVisualSensor(Const HMatrix& matWorld, HLINT hollowIndex);
    }
}
#endif //DEEP_DIVE_PROTOTYPE_V4_H

//Copyright(C) A.K.A Hollow Deep Dive System
//Led by Helios Research Institute
/////////////////////////////////////////

