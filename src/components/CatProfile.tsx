import { EmptyCatProfile } from "./cat/EmptyCatProfile";
import { ExistingCatProfile } from "./cat/ExistingCatProfile";

interface CatProfileProps {
  name?: string;
  imageUrl?: string | null;
  id?: string;
}

export const CatProfile = ({ name, imageUrl, id }: CatProfileProps) => {
  if (!name) {
    return <EmptyCatProfile />;
  }

  return (
    <ExistingCatProfile
      id={id!}
      name={name}
      imageUrl={imageUrl}
    />
  );
};