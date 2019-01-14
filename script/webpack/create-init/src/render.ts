/**
 * render utils
 */

/// code

function br(): void {
  console.log('\n')
}

function hr(): void {
  console.log('\n' + '-'.repeat(60))
}

function header(str: string, icon: string): void {
  console.log(`\n  ${icon} ${str}`)
}

function desc(str: string): void {
  console.log(`\n     ${str}`)
}

function list(li: Array<string>): void {
  console.log(`\n     • ${li}`)
}

export { br, hr, header, desc, list }
