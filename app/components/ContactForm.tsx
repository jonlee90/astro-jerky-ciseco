export function ContactForm() {
  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl w-full bg-gray-100  p-8 rounded-lg shadow-lg">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Customer Service</h3>
            <p className="text-gray-700">
            info@astrofreshjerky.com
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Sales Team</h3>
            <p className="text-gray-700">
              sales.team@astrofreshjerky.com
            </p>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h3 className="text-xl font-semibold text-gray-900">Follow Us</h3>
          <div className="flex space-x-4 justify-center">
            <a href="https://www.facebook.com/astrofreshjerky" className="text-gray-500 hover:text-gray-900">
              Facebook
            </a>
            <a href="https://pinterest.com/astrofreshjerky" className="text-gray-500 hover:text-gray-900">
              Pintrest
            </a>
            <a href="https://www.instagram.com/astrofreshjerky" className="text-gray-500 hover:text-gray-900">
              Instagram
            </a>
            <a href="https://www.x.com/astrofreshjerky" className="text-gray-500 hover:text-gray-900">
              X
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
