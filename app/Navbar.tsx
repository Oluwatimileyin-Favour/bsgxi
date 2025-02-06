import Link from 'next/link';


const Navbar = () => {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-red-500">
                BSG-XI
              </Link>
            </div>
  
            {/* Navigation Links */}
            
            <div className="hidden md:flex space-x-6">
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
                href="#"
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  