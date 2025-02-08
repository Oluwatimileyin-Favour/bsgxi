import Link from 'next/link';

const Navbar = () => {
    return (
      <nav className="shadow-md w-[100%] lg:px-16 xs:px-6">
          <div className="flex justify-between items-center h-16">

            <Link href="/" className="text-2xl font-bold text-red-500">
              BSG-XI
            </Link>

            <div className="space-x-6">
              <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-500 font-medium"
              >
                  Home
              </Link>
              <Link 
                href="admin"
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                Admin
              </Link> 
              <Link
                href="about"
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                About
              </Link>
            </div>
          </div>
      </nav>
    );
  };
  
  export default Navbar;
  