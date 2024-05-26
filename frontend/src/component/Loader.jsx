import { MagnifyingGlass } from 'react-loader-spinner'
export const Loader = () => {
  return (
    <div className='w-screnn h-screen flex justify-center items-center'>
      <MagnifyingGlass
        visible={true}
        height="80"
        width="80"
        ariaLabel="magnifying-glass-loading"
        wrapperStyle={{}}
        wrapperClass="magnifying-glass-wrapper"
        glassColor="#c0efff"
        color="#e15b64"
      />
    </div>
  );
};
