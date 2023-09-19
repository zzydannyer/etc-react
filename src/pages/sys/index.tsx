import * as React from 'react';
import type { FC } from 'react';
import { useState, useEffect, ReactNode } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect } from 'umi';
import type { CommonModelState } from '@/models/commonModel.interface';

interface SysProps extends IRouteComponentProps {
  commonState: CommonModelState;
}

const Sys: FC<SysProps> = (props) => {
  const { children } = props;
  return <>{children}</>;
};

interface StateMdoelType {
  commonState: CommonModelState;
}

// export default Sys
export default connect(({ commonState }: StateMdoelType) => {
  return {
    commonState,
  };
})(Sys);
