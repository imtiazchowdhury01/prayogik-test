import { clientApi } from "../client";

export const clientSideCertificationAccess = async (
  certificationId: string
): Promise<any> => {
  const response = await clientApi.certificationAccess({
    params: {
      certificationId,
    },
  });

  if (response.status !== 200) {
    throw new Error("No Access");
  }

  return response.body;
};
