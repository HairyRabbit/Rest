```code
import { Avatar } from '~component'
import { avatar } from '@rabbitcc/faker'
import style from '../../style/typo.css';
```

# <Avatar />


## 基本用法

```jsx
<Avatar value="path/to/avatar.jpg" />
```

生成默认Avatar组件:

<div className={style.example}>
  <Avatar value={avatar()} />
</div>


## Size, 组件大小

```jsx
<Avatar value="path/to/avatar.jpg" size="lg" />
```

<div className={style.example}>
  <div className={style.row}>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} size="xs" />
      </div>
      size: xs
    </div>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} size="sm" />
      </div>
      size: sm
    </div>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} size="md" />
      </div>
      size: md(默认)
    </div>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} size="lg" />
      </div>
      size: lg
    </div>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} size="xl" />
      </div>
      size: xl
    </div>
  </div>
</div>


## Round, 组件形状

```jsx
<Avatar value="path/to/avatar.jpg" round="md" />
```

<div className={style.example}>
  <div className={style.row}>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} round={false} />
      </div>
      round: false
    </div>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} round={true} />
      </div>
      round: true(默认)
    </div>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} round="sm" />
      </div>
      round: sm
    </div>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} round="md" />
      </div>
      round: md
    </div>
    <div className={style.col}>
      <div className={style.icon}>
        <Avatar value={avatar()} round="lg" />
      </div>
      round: lg
    </div>
  </div>
</div>


## Custom className or style

```jsx
<Avatar value="path/to/avatar.jpg" className="md" />
```

<Avatar value={avatar()} className="custom" />


## code 实例


### 案例1, 引入组件

```jsx
import { Avatar } from '~component'

function Component() {
  return (
    <Avatar value="path/to/avatar.jpg" />
  )
}
```
