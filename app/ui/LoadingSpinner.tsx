import { Oval } from 'react-loader-spinner';

export function LoadingSpinner(){
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                 <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                    />
        </div>
    )
}