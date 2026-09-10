import ButtonLoader from "@/components/Loadercomponents/button-loader";

export default function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-white">
      <div className="bg-black h-14 w-14 rounded-full flex justify-center items-center">
        <ButtonLoader />
      </div>
    </div>
  );
}
