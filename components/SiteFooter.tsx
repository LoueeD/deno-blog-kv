export default function SiteFooter(data: { loggedIn: boolean }) {
  return (
    <footer class="p-6 flex justify-between">
      <a class="text-white text-opacity-50 hover:text-opacity-100" href="https://twitter.com/imlwi">Twitter @imlwi</a>
      <a
        class="text-white text-opacity-50 hover:text-opacity-100"
        href={data.loggedIn ? '/logout' : '/login' }>
          {data.loggedIn ? 'Logout' : 'Login' }
      </a>
    </footer>
  )
}