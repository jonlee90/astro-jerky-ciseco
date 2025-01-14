import clsx from 'clsx';

type IconProps = JSX.IntrinsicElements['svg'] & {
  direction?: 'up' | 'right' | 'down' | 'left';
};

function Icon({
  children,
  className,
  fill = 'currentColor',
  stroke,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      {...props}
      fill={fill}
      stroke={stroke}
      className={clsx('w-5 h-5', className)}
    >
      {children}
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Icon {...props} stroke={props.stroke || 'currentColor'}>
      <title>Menu</title>
      <line x1="3" y1="6.375" x2="17" y2="6.375" strokeWidth="1.25" />
      <line x1="3" y1="10.375" x2="17" y2="10.375" strokeWidth="1.25" />
      <line x1="3" y1="14.375" x2="17" y2="14.375" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props} stroke={props.stroke || 'currentColor'}>
      <title>Close</title>
      <line
        x1="4.44194"
        y1="4.30806"
        x2="15.7556"
        y2="15.6218"
        strokeWidth="1.25"
      />
      <line
        y1="-0.625"
        x2="16"
        y2="-0.625"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconArrow({direction = 'right'}: IconProps) {
  let rotate;

  switch (direction) {
    case 'right':
      rotate = 'rotate-0';
      break;
    case 'left':
      rotate = 'rotate-180';
      break;
    case 'up':
      rotate = '-rotate-90';
      break;
    case 'down':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon className={`w-5 h-5 ${rotate}`}>
      <title>Arrow</title>
      <path d="M7 3L14 10L7 17" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconCaret({
  direction = 'down',
  stroke = 'currentColor',
  className = '',
  ...props
}: IconProps) {
  let rotate;

  switch (direction) {
    case 'down':
      rotate = 'rotate-0';
      break;
    case 'up':
      rotate = 'rotate-180';
      break;
    case 'left':
      rotate = '-rotate-90';
      break;
    case 'right':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon
      {...props}
      className={`transition ${rotate} ${className}`}
      fill="transparent"
      stroke={stroke}
    >
      <title>Caret</title>
      <path d="M14 8L10 12L6 8" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconSelect(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Select</title>
      <path d="M7 8.5L10 6.5L13 8.5" strokeWidth="1.25" />
      <path d="M13 11.5L10 13.5L7 11.5" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconBag(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Bag</title>
      <path
        fillRule="evenodd"
        d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
      />
    </Icon>
  );
}

export function IconLogin(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Login</title>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M8,10.6928545 C10.362615,10.6928545 12.4860225,11.7170237 13.9504747,13.3456144 C12.4860225,14.9758308 10.362615,16 8,16 C5.63738499,16 3.51397752,14.9758308 2.04952533,13.3472401 C3.51397752,11.7170237 5.63738499,10.6928545 8,10.6928545 Z"
          fill="currentColor"
        ></path>
        <path
          d="M8,3.5 C6.433,3.5 5.25,4.894 5.25,6.5 C5.25,8.106 6.433,9.5 8,9.5 C9.567,9.5 10.75,8.106 10.75,6.5 C10.75,4.894 9.567,3.5 8,3.5 Z"
          fill="currentColor"
          fillRule="nonzero"
        ></path>
      </g>
    </Icon>
  );
}

export function IconAccount(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Account</title>
      <path
        fillRule="evenodd"
        d="M9.9998 12.625c-1.9141 0-3.6628.698-5.0435 1.8611C3.895 13.2935 3.25 11.7221 3.25 10c0-3.728 3.022-6.75 6.75-6.75 3.7279 0 6.75 3.022 6.75 6.75 0 1.7222-.645 3.2937-1.7065 4.4863-1.3807-1.1632-3.1295-1.8613-5.0437-1.8613ZM10 18c-2.3556 0-4.4734-1.0181-5.9374-2.6382C2.7806 13.9431 2 12.0627 2 10c0-4.4183 3.5817-8 8-8s8 3.5817 8 8-3.5817 8-8 8Zm0-12.5c-1.567 0-2.75 1.394-2.75 3s1.183 3 2.75 3 2.75-1.394 2.75-3-1.183-3-2.75-3Z"
      />
    </Icon>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Help</title>
      <path d="M3.375 10a6.625 6.625 0 1 1 13.25 0 6.625 6.625 0 0 1-13.25 0ZM10 2.125a7.875 7.875 0 1 0 0 15.75 7.875 7.875 0 0 0 0-15.75Zm.699 10.507H9.236V14h1.463v-1.368ZM7.675 7.576A3.256 3.256 0 0 0 7.5 8.67h1.245c0-.496.105-.89.316-1.182.218-.299.553-.448 1.005-.448a1 1 0 0 1 .327.065c.124.044.24.113.35.208.108.095.2.223.272.383.08.154.12.34.12.558a1.3 1.3 0 0 1-.076.471c-.044.131-.11.252-.197.361-.08.102-.174.197-.283.285-.102.087-.212.182-.328.284a3.157 3.157 0 0 0-.382.383c-.102.124-.19.27-.262.438a2.476 2.476 0 0 0-.164.591 6.333 6.333 0 0 0-.043.81h1.179c0-.263.021-.485.065-.668a1.65 1.65 0 0 1 .207-.47c.088-.139.19-.263.306-.372.117-.11.244-.223.382-.34l.35-.306c.116-.11.218-.23.305-.361.095-.139.168-.3.219-.482.058-.19.087-.412.087-.667 0-.35-.062-.664-.186-.942a1.881 1.881 0 0 0-.513-.689 2.07 2.07 0 0 0-.753-.427A2.721 2.721 0 0 0 10.12 6c-.4 0-.764.066-1.092.197a2.36 2.36 0 0 0-.83.536c-.225.234-.4.515-.523.843Z" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Search</title>
      <path
        fillRule="evenodd"
        d="M13.3 8.52a4.77 4.77 0 1 1-9.55 0 4.77 4.77 0 0 1 9.55 0Zm-.98 4.68a6.02 6.02 0 1 1 .88-.88l4.3 4.3-.89.88-4.3-4.3Z"
      />
    </Icon>
  );
}

export function IconCheck({
  stroke = 'currentColor',
  ...props
}: React.ComponentProps<typeof Icon>) {
  return (
    <Icon {...props} fill="transparent" stroke={stroke}>
      <title>Check</title>
      <circle cx="10" cy="10" r="7.25" strokeWidth="1.25" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m7.04 10.37 2.42 2.41 3.5-5.56"
      />
    </Icon>
  );
}

export function IconXMark({
  stroke = 'currentColor',
  ...props
}: React.ComponentProps<typeof Icon>) {
  return (
    <Icon {...props} fill="transparent" stroke={stroke}>
      <title>Delete</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </Icon>
  );
}

export function IconRemove(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
      <title>Remove</title>
      <path
        d="M4 6H16"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.5 6L6 17H14L14.5 6"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconFilters(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
      <title>Filters</title>
      <circle cx="4.5" cy="6.5" r="2" />
      <line x1="6" y1="6.5" x2="14" y2="6.5" />
      <line x1="4.37114e-08" y1="6.5" x2="3" y2="6.5" />
      <line x1="4.37114e-08" y1="13.5" x2="8" y2="13.5" />
      <line x1="11" y1="13.5" x2="14" y2="13.5" />
      <circle cx="9.5" cy="13.5" r="2" />
    </Icon>
  );
}

export function IconBundle({className = '', ...props
}: IconProps) {
  return (
   <svg className={`w-8 -rotate-90 ${className}`} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g id="Outlines"><g><path d="M54.826,54.838a13.861,13.861,0,0,1-11.5,5.146A14.2,14.2,0,0,1,30,45.576V30a1,1,0,0,0-2,0V45.576A16.457,16.457,0,0,0,36.34,60H19.292a.934.934,0,0,0-.23-.042A14.257,14.257,0,0,1,6,45.576V29.464a1,1,0,0,0-2,0V45.576A16.27,16.27,0,0,0,18.633,61.93.978.978,0,0,0,19,62H44a15.84,15.84,0,0,0,12.371-5.9,1,1,0,1,0-1.549-1.264Z"/><path d="M53.1,32.852A7.477,7.477,0,0,1,50,26.773l0-.142A11.064,11.064,0,0,0,42,16.43V13.39A26.847,26.847,0,0,1,43.929,3.372,1,1,0,0,0,43,2H37a1,1,0,0,0-.929.628A28.866,28.866,0,0,0,34,13.39V16H31V13.39A26.847,26.847,0,0,1,32.929,3.372,1,1,0,0,0,32,2H26a1,1,0,0,0-.929.628A28.866,28.866,0,0,0,23,13.39a1,1,0,0,0,2,0A26.853,26.853,0,0,1,26.686,4h3.877A28.816,28.816,0,0,0,29,13.39V16H20V13.39A26.847,26.847,0,0,1,21.929,3.372,1,1,0,0,0,21,2H15a1,1,0,0,0-.929.628A28.866,28.866,0,0,0,12,13.39v3.045A11.009,11.009,0,0,0,4.055,25.9,1,1,0,0,0,4.952,27a.831.831,0,0,0,.1,0,1,1,0,0,0,.994-.9,9.006,9.006,0,0,1,8.06-8.043A.832.832,0,0,0,14.331,18H32.682a10.946,10.946,0,0,0-4.627,7.9,1,1,0,0,0,1.99.2,8.982,8.982,0,0,1,9.4-8.088A9.156,9.156,0,0,1,48,26.7l0,.1a9.461,9.461,0,0,0,3.951,7.685A13.652,13.652,0,0,1,58,46a14.04,14.04,0,0,1-1.209,5.664,1,1,0,0,0,.508,1.319.987.987,0,0,0,.405.086,1,1,0,0,0,.915-.595A16.016,16.016,0,0,0,60,46,15.809,15.809,0,0,0,53.1,32.852ZM36,13.39A26.853,26.853,0,0,1,37.686,4h3.877A28.816,28.816,0,0,0,40,13.39v2.667c-.154-.014-.3-.037-.461-.044S36,16,36,16ZM14,16V13.39A26.853,26.853,0,0,1,15.686,4h3.877A28.816,28.816,0,0,0,18,13.39V16Z"/><path d="M34.061,22.676a.991.991,0,0,0-.871.446,6.909,6.909,0,0,0-1.152,3.161l-.032.275A1.051,1.051,0,0,0,32,26.67v6.422a1,1,0,0,0,.7.954l.6.187a8.312,8.312,0,0,1,4.589,12.311l-3.4,5.486a1,1,0,0,0,.051,1.126,11.829,11.829,0,0,0,8.876,4.83c.2.009.39.014.583.014a12,12,0,0,0,3.893-.656,1,1,0,0,0,.383-1.653l-1.5-1.5a8.3,8.3,0,0,1,5.706-14.18,1,1,0,0,0-.043-2,10.3,10.3,0,0,0-7.077,17.594l.258.258a9.631,9.631,0,0,1-9.059-3.381L39.587,47.6A10.312,10.312,0,0,0,34,32.357v-5.63l.026-.232a4.632,4.632,0,0,1,.1-.6l1.119,1.989a10.343,10.343,0,0,0,9.011,5.254,9.933,9.933,0,0,0,1.321-.091,13,13,0,0,0,2.873,3.763,1,1,0,0,0,1.339-1.486,11.184,11.184,0,0,1-2.723-3.8,1,1,0,0,0-1.119-.571,8.291,8.291,0,0,1-8.959-4.052L34.9,23.186A1,1,0,0,0,34.061,22.676Z"/><path d="M44.238,29.128a6.247,6.247,0,0,0,1.017-.083,1,1,0,0,0,.833-1.1c-.044-.385-.084-.774-.092-1.18a7.119,7.119,0,0,0-6.648-6.757,6.939,6.939,0,0,0-2.372.313,1,1,0,0,0-.584,1.448l2.338,4.156A6.327,6.327,0,0,0,44.238,29.128Zm-4.986-7.122A5.079,5.079,0,0,1,44,26.82c0,.1.006.2.012.3a4.319,4.319,0,0,1-3.535-2.177L38.819,22C38.964,22,39.106,22,39.252,22.006Z"/><path d="M51.071,54.485a1,1,0,0,0,1.414,0,11.875,11.875,0,0,0,3.04-11.759A1,1,0,0,0,54.564,42H52.657a6.314,6.314,0,0,0-4.465,10.778,1,1,0,0,0,1.414-1.414A4.314,4.314,0,0,1,52.657,44h1.126A9.636,9.636,0,0,1,54,46a9.934,9.934,0,0,1-2.929,7.071A1,1,0,0,0,51.071,54.485Z"/><path d="M32,41.576a1,1,0,0,0,2,0V39.25a4.326,4.326,0,0,1,.487,5.188L32.47,47.7a1,1,0,1,0,1.7,1.053l2.018-3.258a6.313,6.313,0,0,0-2.78-9.08A1,1,0,0,0,32,37.324Z"/><path d="M22,25a1,1,0,0,0-1,1V45.576a16.662,16.662,0,0,0,4.217,11.091,1,1,0,1,0,1.494-1.33A14.661,14.661,0,0,1,23,45.576V26A1,1,0,0,0,22,25Z"/><path d="M13,25a1,1,0,0,0-1,1V45.576a16.662,16.662,0,0,0,4.217,11.091,1,1,0,1,0,1.494-1.33A14.661,14.661,0,0,1,14,45.576V26A1,1,0,0,0,13,25Z"/></g></g></svg>
  )
}
export function IconJerky({className = '', ...props
}: IconProps) {
  return (
    <svg className={`w-8 rotate-45 ${className}`} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g id="Outlines"><g><path d="M18.973,62a14.331,14.331,0,0,1-2.05-.148,13.893,13.893,0,0,1-8.744-4.973,1,1,0,0,1,1.545-1.27,11.9,11.9,0,0,0,7.484,4.264A12.046,12.046,0,0,0,28,55.943a66.788,66.788,0,0,1,9.465-9.107l6.089-4.662c1.424-1.091,2.911-2.045,4.569-3.089a18.929,18.929,0,0,0,8.882-16,18.622,18.622,0,0,0-1.273-6.818,1,1,0,0,1,1.865-.721A20.6,20.6,0,0,1,59,23.1a20.918,20.918,0,0,1-9.816,17.679c-1.615,1.018-3.061,1.945-4.418,2.985l-6.09,4.662a64.92,64.92,0,0,0-9.182,8.843A14,14,0,0,1,18.973,62Z"/><path d="M6.911,53.8a1,1,0,0,1-.93-.631,13.684,13.684,0,0,1-.831-3.086A13.965,13.965,0,0,1,9.077,38.124a24.775,24.775,0,0,0,6.3-10.061l.794-2.548a26.559,26.559,0,0,0,.973-4.955A20.957,20.957,0,0,1,55.7,11.8a1,1,0,1,1-1.686,1.076,18.958,18.958,0,0,0-34.89,7.914,28.819,28.819,0,0,1-1.049,5.321l-.795,2.548a26.74,26.74,0,0,1-6.789,10.876A11.986,11.986,0,0,0,7.129,49.792a11.725,11.725,0,0,0,.71,2.634A1,1,0,0,1,6.911,53.8Z"/><g><path d="M26.9,33.084a14.449,14.449,0,0,1-5.3-1,16.368,16.368,0,0,0-2.019-.648,1,1,0,0,1-.7-1.3l.093-.257c.074-.205.148-.41.213-.618l.795-2.549a30.71,30.71,0,0,0,1.127-5.686,16.679,16.679,0,0,1,.441-2.284,1,1,0,0,1,1.944.027,19.194,19.194,0,0,0,8.187,11.814,1,1,0,0,1-.24,1.785l-.055.018A14.65,14.65,0,0,1,26.9,33.084ZM21.12,29.79q.618.2,1.217.431a12.538,12.538,0,0,0,6.471.719,21.112,21.112,0,0,1-5.961-7.817A29.062,29.062,0,0,1,21.9,27.3Z"/><path d="M33.213,47.428a1,1,0,0,1-.972-.771L31.5,43.522a16.581,16.581,0,0,0-.621-2,6.057,6.057,0,0,1,.349-5.215,5.734,5.734,0,0,1,4.026-2.819,23.679,23.679,0,0,1,12.762,1.342,1,1,0,0,1,.232,1.727c-.387.293-.784.576-1.2.839-1.7,1.071-3.228,2.051-4.718,3.191L36.921,44.73a1,1,0,1,1-1.216-1.587L41.118,39c1.391-1.066,2.793-1.983,4.319-2.951a21.678,21.678,0,0,0-9.842-.589A3.692,3.692,0,0,0,32.968,37.3a4.017,4.017,0,0,0-.246,3.435l.036.1a18.291,18.291,0,0,1,.692,2.236l.738,3.135a1,1,0,0,1-.975,1.229Z"/><path d="M50.721,33.705a1,1,0,0,1-.793-1.608A14.86,14.86,0,0,0,53,23.071,14.991,14.991,0,0,0,28.318,11.553,3.719,3.719,0,0,0,27,14.4,15.338,15.338,0,0,0,37.787,29.1l.17.015a60.517,60.517,0,0,1,9.786,1.466,1,1,0,0,1-.5,1.937,58.506,58.506,0,0,0-9.455-1.41,1.994,1.994,0,0,1-.492-.066A17.329,17.329,0,0,1,25,14.4a5.717,5.717,0,0,1,2.025-4.372,16.966,16.966,0,0,1,11.9-4A17.176,17.176,0,0,1,55,23.08a16.844,16.844,0,0,1-3.483,10.232A1,1,0,0,1,50.721,33.705Z"/><path d="M15.163,45.072a27.466,27.466,0,0,1-4.238-.331A1,1,0,0,1,10.2,43.28a10.032,10.032,0,0,1,1.714-2.334,30.752,30.752,0,0,0,5.4-7.212,1,1,0,0,1,1.076-.51,14.242,14.242,0,0,1,9.868,7.311,1,1,0,0,1-.412,1.352A26.833,26.833,0,0,1,15.163,45.072ZM12.792,42.96a24.833,24.833,0,0,0,13.18-2.367,12.245,12.245,0,0,0-7.266-5.247,33.151,33.151,0,0,1-5.376,7.011A7.6,7.6,0,0,0,12.792,42.96Z"/><path d="M19,58a10.639,10.639,0,0,1-1.506-.109,10.086,10.086,0,0,1-8.385-8.384,10.294,10.294,0,0,1-.085-1.9,1,1,0,0,1,1.167-.946,28.878,28.878,0,0,0,10.6-.138,1,1,0,1,1,.395,1.96,30.765,30.765,0,0,1-10.144.33c.012.141.027.277.046.411A8,8,0,0,0,25,53.294c1.3-1.467,2.515-2.778,3.71-3.992a3.2,3.2,0,0,0-1.386-1.552,3.052,3.052,0,0,0-2.484-.241,1,1,0,0,1-.631-1.9A5.1,5.1,0,0,1,28.3,46a5.2,5.2,0,0,1,2.522,3.344,1,1,0,0,1-.267.936c-1.3,1.306-2.632,2.724-4.055,4.335A10.011,10.011,0,0,1,19,58Z"/></g><path d="M40,27a7,7,0,1,1,7-7A7.008,7.008,0,0,1,40,27Zm0-12a5,5,0,1,0,5,5A5.006,5.006,0,0,0,40,15Z"/><path d="M40,23a3,3,0,1,1,3-3A3,3,0,0,1,40,23Zm0-4a1,1,0,1,0,1,1A1,1,0,0,0,40,19Z"/></g></g></svg>
  )
}
export function IconHome({className = '', ...props
}: IconProps) {
  return (
    <svg className={`w-8 opacity-80 ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M240 192h-8v-61.43l1.49 2.08a8 8 0 1 0 13-9.3l-40-56a8 8 0 0 0-2-1.94L137 18.77l-.1-.07a16 16 0 0 0-17.76 0l-.1.07l-67.59 46.65a8 8 0 0 0-2 1.94l-40 56a8 8 0 1 0 13 9.3l1.55-2.09V192h-8a8 8 0 0 0 0 16h224a8 8 0 0 0 0-16M40 108.17l21.7-30.38L128 32l66.3 45.78l21.7 30.39V192h-24v-72a8 8 0 0 0-8-8H72a8 8 0 0 0-8 8v72H40Zm88 42L97 128h62Zm48-14.62v48.91L141.76 160ZM114.24 160L80 184.46v-48.91Zm13.76 9.83L159 192H97ZM104 88a8 8 0 0 1 8-8h32a8 8 0 1 1 0 16h-32a8 8 0 0 1-8-8"/></svg>
  )
}
export function IconReward({className = '', ...props
}: IconProps) {
  return (
    <svg className={`w-8 ${className}`} id="Layer_1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><style>{`.cls-1,.cls-2{fill:none;stroke:#000;strokeLinecap:round;strokeLinejoin:round;}.cls-1{strokeWidth:1px;}`}</style></defs><title/><path className="cls-1" d="M12.2,11.376l.959,1.943a.229.229,0,0,0,.17.123l2.144.312a.225.225,0,0,1,.125.384l-1.551,1.513a.224.224,0,0,0-.065.2l.366,2.136a.226.226,0,0,1-.327.238l-1.918-1.009a.229.229,0,0,0-.21,0L9.977,18.224a.226.226,0,0,1-.327-.238l.366-2.136a.224.224,0,0,0-.065-.2L8.4,14.138a.225.225,0,0,1,.125-.384l2.144-.312a.229.229,0,0,0,.17-.123l.959-1.943A.225.225,0,0,1,12.2,11.376Z"/><polyline className="cls-2" points="5.789 9.116 3.795 5.5 6.205 2.5 8.738 7.143"/><polyline className="cls-2" points="18.211 9.116 20.205 5.5 17.795 2.5 15.262 7.143"/><line className="cls-2" x1="6.205" x2="17.5" y1="2.5" y2="2.5"/><line className="cls-2" x1="7.842" x2="16.158" y1="5.5" y2="5.5"/><circle className="cls-2" cx="12" cy="15" r="7"/></svg>
  )
}
export function IconCart({className = '', color='#ffffff'}) {
  return (
    <svg className={`size-14 ${className}`} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h256v256H0z"></path><circle cx="80" cy="216" r="16" fill={color} ></circle><circle cx="184" cy="216" r="16" fill={color}></circle><path d="M42.3 72h179.4l-26.4 92.4a15.9 15.9 0 0 1-15.4 11.6H84.1a15.9 15.9 0 0 1-15.4-11.6L32.5 37.8a8 8 0 0 0-7.7-5.8H8" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
  )
}
export function IconAdd({className = ''}) {
  return (
    <svg className={`w-12 ${className}`} enableBackground="new 0 0 24 24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 24c-6.617 0-12-5.383-12-12s5.383-12 12-12 12 5.383 12 12-5.383 12-12 12zm0-22c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zm5 11h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.553 0 1 .448 1 1s-.447 1-1 1zm-5 5c-.552 0-1-.447-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10c0 .553-.448 1-1 1z"/></svg>
  )
}
export function IconMinus({className = '', size = 48}) {
  return (
    <svg className={`w-12 ${className} feather feather-minus-circle`}  fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
    )
  }
export function IconFacebook({size = 18}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="black" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"/></svg>
    )
}
export function IconX({size = 18}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="black" d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
  )
}
export function IconPinterest({size = 18}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32"><path fill="black" d="M16.094 4C11.017 4 6 7.383 6 12.861c0 3.483 1.958 5.463 3.146 5.463c.49 0 .774-1.366.774-1.752c0-.46-1.174-1.44-1.174-3.355c0-3.978 3.028-6.797 6.947-6.797c3.37 0 5.864 1.914 5.864 5.432c0 2.627-1.055 7.554-4.47 7.554c-1.231 0-2.284-.89-2.284-2.166c0-1.87 1.197-3.681 1.197-5.611c0-3.276-4.537-2.682-4.537 1.277c0 .831.104 1.751.475 2.508C11.255 18.354 10 23.037 10 26.066c0 .935.134 1.855.223 2.791c.168.188.084.169.341.075c2.494-3.414 2.263-4.388 3.391-8.856c.61 1.158 2.183 1.781 3.43 1.781c5.255 0 7.615-5.12 7.615-9.738C25 7.206 20.755 4 16.094 4"/></svg>
  )
}
export function IconSpicyThree({size = 16}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className='inline-block' width={size} height={size} viewBox="0 0 24 24"><path fill="black" d="m10.43 7.32l-1.57-.9C9.38 5.6 10.11 5 10.94 4.7A.99.99 0 0 0 10 4V2c.77 0 1.47.29 2 .77V4c.45 0 .81.3.94.7c-1.11.38-2.01 1.35-2.51 2.62M10 11c0-.77.23-1.5.6-2.09l-1.34-.76C8.5 8.44 8 9.16 8 10v1c0 7.05 4.9 9.8 7.03 10.66C12.41 19.62 10 16.2 10 11M6.43 7.32l-1.57-.9C5.38 5.6 6.11 5 6.94 4.7A.99.99 0 0 0 6 4V2c.77 0 1.47.29 2 .77V4c.45 0 .81.3.94.7c-1.11.38-2.01 1.35-2.51 2.62M6 11c0-.77.23-1.5.6-2.09l-1.34-.76C4.5 8.44 4 9.16 4 10v1c0 7.05 4.9 9.8 7.03 10.66C8.41 19.62 6 16.2 6 11m13-2.72L17.75 9L16 8l-1.75 1L13 8.28c-.6.35-1 .99-1 1.72v1c0 9 8 11 8 11V10c0-.73-.4-1.37-1-1.72m-6.27-1.65l1.52.87l1.75-1l1.75 1l1.52-.87c-.55-.97-1.36-1.69-2.3-1.98A2.996 2.996 0 0 0 14 2v2c.44 0 .8.29.94.69c-.91.31-1.68 1.01-2.21 1.94"/></svg>
  )
}
export function IconDry({size = 16}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Beef jerky dryness level" width={size} height={size} viewBox="0 0 24 24"><path fill="#000" d="M7 22a1 1 0 0 1-.117-1.993L7 20h2v-6a4 4 0 0 1-3.995-3.8L5 10V9a1 1 0 0 1 1.993-.117L7 9v1a2 2 0 0 0 1.85 1.995L9 12V5a3 3 0 0 1 5.995-.176L15 5v10a2 2 0 0 0 1.995-1.85L17 13V8a1 1 0 0 1 1.993-.117L19 8v5a4 4 0 0 1-3.8 3.995L15 17v3h2a1 1 0 0 1 .117 1.993L17 22z"/></svg>
   )
}
export function IconSpicy({size = 16}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Beef jerky spicy level" className='inline-block' width={size} height={size} viewBox="0 0 256 256"><path fill="black" d="M167.27 40.42A40.06 40.06 0 0 0 128 8a8 8 0 0 0 0 16a24 24 0 0 1 22.85 16.66A64.08 64.08 0 0 0 96 104c0 46.75-25.75 78-76.53 93a16 16 0 0 0 1.77 31.13A265 265 0 0 0 66.75 232c40.78 0 86.16-9.15 117.53-35.46C210.64 174.44 224 143.3 224 104a64.07 64.07 0 0 0-56.73-63.58M192 95l-28.42-14.17a8 8 0 0 0-7.16 0L128 95l-13.37-6.68a48 48 0 0 1 90.74 0Z"/></svg>
  )
}
export function IconChicken({size = 16}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className='inline-block' width={size} height={size} viewBox="0 0 24 24"><path fill="black" d="M19.886 7.426c.057-.011.126-.018.179-.026a.4.4 0 0 1 .2.049a.061.061 0 0 0 .089-.067c-.02-.063-.049-.138-.065-.19a.14.14 0 0 0-.1-.093a.106.106 0 0 1-.081-.126a.3.3 0 0 1 .049-.108a.76.76 0 0 0 .142-.64a.5.5 0 0 0-.2-.261a.077.077 0 0 1-.02-.115a.23.23 0 0 0 .044-.13a.9.9 0 0 0-.06-.294a.5.5 0 0 1 0-.168c.016-.078-.086-.126-.086-.126s.077-.082 0-.246s-.6-.215-.6-.215s.077-.335-.345-.5c-.341-.13-.613.4-.706.617a.124.124 0 0 1-.142.067a.08.08 0 0 1-.053-.13l.28-.3a.112.112 0 0 0-.041-.179l-.032-.015l.016-.007a.236.236 0 0 0 .146-.3v-.001a.24.24 0 0 0-.142-.145l-.058-.023a.27.27 0 0 1-.138-.126l-.044-.089a.28.28 0 0 0-.268-.145a1.46 1.46 0 0 0-.894.412c-.511.469-.869 2.523-.93 2.928a.25.25 0 0 1-.06.127q-.08.096-.268.305a3.73 3.73 0 0 1-1.708 1.027a18 18 0 0 1-2.3.126a6.7 6.7 0 0 1-2.347-.405c-.538-.314-.997-1.946-1.61-2.552a3.4 3.4 0 0 0-1.559-.811a1.1 1.1 0 0 0-.341-.015a.076.076 0 0 1-.077-.112a1 1 0 0 0 .073-.138c.008-.048-.069-.167-.069-.167l-.138-.112l-.057-.078l-.155-.048l-.028-.019a.072.072 0 0 0-.1.037l-.045.131s-.1-.2-.167-.168c-.109.056 0 .35 0 .35s-.2-.335-.312-.283c-.2.09.04.521.04.521s-.15-.264-.255-.223c-.053.018 0 .35 0 .35s-.109-.038-.15-.019s.045.279.045.279H4.31a.08.08 0 0 0-.077.052l-.016.045l-.073.059a.21.21 0 0 0-.073.2l.016.086l-.021.089l.009.1a1.8 1.8 0 0 0-.313.294a.83.83 0 0 0-.118.457a.4.4 0 0 1 .179-.119l.191-.1a.66.66 0 0 1 .381-.067h.24a1.3 1.3 0 0 0-.1.361a.574.574 0 0 0 .669.566a.54.54 0 0 0 .39-.257A7 7 0 0 0 4.952 8.8a4.64 4.64 0 0 0 .921 3.318C7.035 13.6 8.781 13.971 9.2 14.272s.974.923 1.364 1.131c.345.186.845.729 1.393 1.15a3.7 3.7 0 0 0 .642.431a12 12 0 0 1-.662 2.065a.28.28 0 0 1-.285.156a6 6 0 0 0-.836-.022a2.3 2.3 0 0 0-.54.167c-.041.015-.024.067.016.067c.191 0 .483 0 .593.011c0 0 .219.067.223.067c-.032 0-.3.008-.345.012a7 7 0 0 0-1.218.186a.036.036 0 0 0 .008.07c.2.019.585.056.755.082c.256.041.362.164.63.212a1.7 1.7 0 0 1-.309.164c-.13.03-.312.335-.422.536c-.016.029.02.063.057.048c.227-.119.731-.387.792-.409a5.6 5.6 0 0 1 1.27-.376c.029-.007.078-.019.159-.145c.219.03.463.071.662.108a1.6 1.6 0 0 1-.309.163c-.13.03-.3.324-.418.529a.039.039 0 0 0 .057.048c.2-.115.572-.335.735-.42a7 7 0 0 1 1.319-.354c.033-.007.094-.026.2-.216a.3.3 0 0 1 .171-.137a1.8 1.8 0 0 1 .426-.108c.09.1.382.1.512.093h.085a.025.025 0 0 0 .02-.041l-.056-.059c0-.008-.143-.153-.248-.253a1.5 1.5 0 0 0-.646-.1c.094-.253.207-.577.333-1.012c.118-.372.224-.748.309-1.075a2.08 2.08 0 0 0 1.027-1.112a2.96 2.96 0 0 0 1.218-2a8.5 8.5 0 0 0-.58-2.392a3.9 3.9 0 0 0 1.266-.4a2.68 2.68 0 0 0 .845-1.715a8 8 0 0 0 .049-1.034a.22.22 0 0 1 .122-.175a.7.7 0 0 0 .146-.085A2.7 2.7 0 0 1 20.243 8a.067.067 0 0 0 .053-.1a.9.9 0 0 0-.207-.205l-.236-.156a.064.064 0 0 1 .033-.113M14.2 19.041c-.04.09-.2.09-.308.082a5 5 0 0 0-.861-.022a3 3 0 0 0-.333.048c.089-.245.585-1.856.682-2.221a4.5 4.5 0 0 0 .755-.457c.285-.264.309-.395.309-.395a1.4 1.4 0 0 0 .451.8a12.6 12.6 0 0 1-.695 2.165"/></svg>
  )
}
export function IconPepper({size = 16}) {
  return (
    <svg fill="#000000" className='inline-block' height={size} width={size} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 60 60">
    <path d="M42.228,49.644c-0.281-0.385-0.281-0.902,0-1.287c0.67-0.915,0.916-2.036,0.692-3.155c-0.024-0.119-0.068-0.229-0.102-0.344
      C42.926,44.566,43,44.281,43,44v-0.353c0-1.756-0.39-3.526-1.158-5.263c-2.465-5.571-2.457-10.149,0.026-15.802
      C42.619,20.872,43,19.122,43,17.381V16c0-0.81-0.368-1.567-1.093-2.26C42.595,12.657,43,11.376,43,10c0-3.859-3.141-7-7-7h-3V0h-6v3
      h-3c-3.859,0-7,3.141-7,7c0,1.376,0.405,2.656,1.093,3.74C17.368,14.432,17,15.19,17,16v1.375c0,1.745,0.383,3.499,1.138,5.213
      c2.479,5.634,2.482,10.212,0.015,15.803C17.388,40.123,17,41.89,17,43.64V44c0,0.28,0.074,0.566,0.182,0.857
      c-0.034,0.114-0.078,0.224-0.102,0.343c-0.224,1.12,0.022,2.241,0.692,3.156c0.281,0.385,0.281,0.902,0,1.287
      c-0.631,0.861-0.87,1.906-0.712,2.962C17.027,52.751,17,52.906,17,53.084V60h26v-6.916c0-0.177-0.028-0.333-0.061-0.479
      C43.098,51.55,42.859,50.505,42.228,49.644z M19.306,53.048c-0.116-0.186-0.203-0.392-0.253-0.614l-0.018-0.081
      c-0.092-0.545,0.028-1.086,0.351-1.528c0.188-0.257,0.328-0.536,0.428-0.825H23c0.553,0,1-0.447,1-1s-0.447-1-1-1h-3.187
      c-0.099-0.289-0.24-0.568-0.428-0.825c-0.335-0.457-0.457-1.02-0.345-1.585c0.021-0.104,0.053-0.204,0.092-0.302l0.026-0.061
      c0.003-0.007,0.008-0.014,0.011-0.021c0.059-0.135,0.142-0.252,0.226-0.368c0.311-0.402,0.781-0.694,1.317-0.796
      c0.04-0.006,0.078-0.014,0.119-0.018C20.931,44.012,21.03,44,21.132,44h17.736c0.102,0,0.201,0.012,0.3,0.025
      c0.04,0.004,0.079,0.012,0.119,0.018c0.536,0.102,1.006,0.394,1.318,0.797c0.083,0.115,0.165,0.23,0.223,0.363
      c0.004,0.01,0.01,0.018,0.015,0.028l0.024,0.056c0.039,0.098,0.072,0.199,0.092,0.304c0.112,0.564-0.01,1.127-0.345,1.584
      c-0.188,0.257-0.328,0.536-0.428,0.825H31c-0.553,0-1,0.447-1,1s0.447,1,1,1h9.187c0.099,0.289,0.24,0.568,0.428,0.825
      c0.324,0.442,0.444,0.984,0.351,1.528l-0.018,0.08c-0.05,0.221-0.137,0.427-0.253,0.613C40.317,53.618,39.625,54,38.869,54H21.131
      C20.375,54,19.683,53.618,19.306,53.048z M29,2h2v1h-2V2z M28,35h-2V24h5c2.206,0,4,1.794,4,4s-1.794,4-4,4h-3V35z M28,30h3
      c1.103,0,2-0.897,2-2s-0.897-2-2-2h-3V30z"/>
    </svg>
  )
}
export function IconBbq({size = 16}) {
  return (
    <svg version="1.0" className='inline-block' xmlns="http://www.w3.org/2000/svg"
       role="img" aria-label="Beef jerky sweetness level"
      width={size} height={size} viewBox="0 0 512.000000 512.000000"
      preserveAspectRatio="xMidYMid meet">

      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
      fill="#000000" stroke="none">
      <path d="M1922 5109 c-19 -6 -53 -29 -77 -53 -59 -59 -68 -105 -63 -326 3
      -165 4 -178 28 -220 14 -24 43 -56 65 -71 l41 -27 -8 -106 c-15 -223 -62 -405
      -149 -581 -61 -122 -137 -230 -294 -415 -154 -182 -195 -237 -253 -335 -96
      -161 -142 -296 -167 -482 -22 -163 -22 -2063 0 -2146 44 -169 163 -288 332
      -332 86 -22 2280 -22 2366 0 167 43 288 164 332 330 13 51 15 192 15 1047 0
      1090 -2 1129 -61 1316 -63 198 -144 328 -379 607 -186 221 -259 330 -322 477
      -66 154 -113 368 -120 546 l-3 74 40 27 c22 15 51 47 65 71 24 44 25 50 25
      250 0 200 -1 206 -25 250 -14 24 -45 58 -68 75 l-44 30 -621 2 c-379 1 -635
      -2 -655 -8z m1248 -159 c18 -18 20 -33 20 -190 0 -157 -2 -172 -20 -190 -20
      -20 -33 -20 -610 -20 -577 0 -590 0 -610 20 -18 18 -20 33 -20 190 0 157 2
      172 20 190 20 20 33 20 610 20 577 0 590 0 610 -20z m-116 -572 c3 -13 7 -65
      10 -117 6 -98 45 -306 70 -378 l15 -43 -589 0 -588 0 19 63 c31 101 60 265 65
      372 3 55 7 106 10 113 3 9 110 12 493 12 l491 0 4 -22z m185 -746 c52 -103
      145 -232 308 -427 220 -264 284 -364 336 -530 26 -82 40 -154 52 -257 l6 -58
      -621 0 -621 0 -24 -25 c-14 -13 -25 -36 -25 -50 0 -14 11 -37 25 -50 l24 -25
      621 0 620 0 0 -665 0 -665 -620 0 -621 0 -24 -25 c-30 -30 -32 -64 -4 -99 l20
      -26 626 0 625 0 -4 -177 c-3 -162 -5 -182 -26 -225 -31 -62 -87 -119 -148
      -149 l-49 -24 -1155 0 -1155 0 -47 23 c-62 31 -119 87 -149 148 -22 45 -24 63
      -27 227 l-4 177 618 0 618 0 23 22 c33 30 31 80 -3 107 -26 21 -35 21 -640 21
      l-614 0 0 665 0 665 617 0 617 0 23 22 c30 28 30 74 1 105 l-21 23 -619 0
      -619 0 6 58 c24 213 74 358 180 522 23 36 115 153 204 260 166 199 260 328
      312 432 l29 58 650 0 650 0 29 -58z"/>
      <path d="M1421 1964 c-20 -26 -21 -38 -21 -379 0 -333 1 -354 19 -376 19 -24
      21 -24 228 -24 196 0 210 1 249 22 56 30 109 93 124 149 25 87 -11 204 -76
      251 -26 19 -26 20 -10 51 20 38 21 140 3 185 -22 52 -68 98 -122 123 -46 22
      -63 24 -212 24 l-162 0 -20 -26z m354 -149 c38 -37 35 -95 -6 -129 -28 -24
      -38 -26 -125 -26 l-94 0 0 90 0 90 100 0 c94 0 103 -2 125 -25z m79 -336 c33
      -38 33 -79 2 -116 -24 -28 -25 -28 -165 -31 l-141 -4 0 91 0 91 139 0 139 0
      26 -31z"/>
      <path d="M2223 1970 l-23 -21 0 -363 c0 -356 0 -363 21 -382 19 -17 41 -19
      200 -22 220 -4 268 6 334 73 97 96 96 234 -1 335 l-34 36 16 48 c36 106 -5
      222 -100 281 -49 30 -50 30 -220 33 -162 3 -172 2 -193 -18z m351 -156 c34
      -35 35 -83 2 -121 -23 -27 -29 -28 -125 -31 l-101 -4 0 91 0 91 99 0 c93 0
      100 -1 125 -26z m69 -324 c31 -25 42 -65 26 -102 -20 -48 -53 -58 -194 -58
      l-125 0 0 90 0 90 134 0 c118 0 136 -2 159 -20z"/>
      <path d="M3223 1976 c-107 -35 -185 -105 -237 -215 -29 -62 -31 -73 -31 -176
      0 -105 2 -114 33 -177 96 -195 315 -278 496 -188 l39 19 39 -34 c46 -42 96
      -47 128 -13 30 33 25 72 -15 117 l-35 38 25 56 c75 163 46 343 -74 470 -71 75
      -143 108 -245 113 -52 3 -96 -1 -123 -10z m192 -155 c92 -42 155 -159 141
      -264 -6 -43 -18 -80 -32 -96 -2 -2 -26 17 -53 42 -56 53 -97 61 -131 27 -35
      -35 -26 -79 25 -130 24 -24 42 -47 40 -51 -11 -17 -86 -20 -139 -5 -42 13 -64
      27 -98 65 -51 56 -68 104 -68 188 0 172 168 291 315 224z"/>
      </g>
      </svg>
  )
}
export function IconStar({content, label = 'pt', contentX, contentY, contentSize}) {
  return (
      <svg className='size-28' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="black" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575l-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957l-3.686-1.894a.5.5 0 0 0-.461 0z"/>
        <text className='font-bold' x={contentX} y={contentY} fontFamily="RobotoMedium" fontSize={contentSize} fill="black">{content}</text>
        <text x="7" y="11" fontFamily="RobotoMedium" fontSize="2" fill="black">{label}</text>
      </svg>
  )
}
export function IconDollar({className = ''}) {
  return (
    <svg className={`size-28 ${className}`} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="black" d="M22.854 6.008c-2.69.074-4.775.804-6.805 1.51c-2.171.754-4.22 1.465-7.059 1.494c-1.897.03-3.797-.298-5.664-.944L2 7.61v17.082l.666.237c1.739.615 3.517.97 5.287 1.054c.281.013.556.02.826.02c3.013 0 5.32-.8 7.557-1.572c2.358-.816 4.582-1.587 7.617-1.444a16.48 16.48 0 0 1 4.713.944l1.334.472V7.314l-.658-.24a17.78 17.78 0 0 0-5.297-1.056a16.56 16.56 0 0 0-1.191-.01m.054 1.986c.34-.01.688-.01 1.049.004c.374.016.748.05 1.121.094A2.495 2.495 0 0 0 28 9.949v9.102a2.495 2.495 0 0 0-2.957 2.025a17.643 17.643 0 0 0-.996-.074c-3.415-.15-5.933.709-8.367 1.553c-2.361.818-4.598 1.591-7.631 1.447a15.746 15.746 0 0 1-1.13-.1A2.495 2.495 0 0 0 4 22.051v-9.102a2.493 2.493 0 0 0 2.959-2.05c.685.071 1.37.112 2.053.101c3.165-.032 5.466-.833 7.693-1.607c1.961-.683 3.83-1.325 6.203-1.399M16 12c0 1.439-.561 2-2 2v2c.776 0 1.437-.151 2-.412V20h2v-8zm7.5 1a1.5 1.5 0 0 0 0 3a1.5 1.5 0 0 0 0-3m-15 3a1.5 1.5 0 0 0 0 3a1.5 1.5 0 0 0 0-3"/></svg>
  )
}
export function IconDollarSign({className = ''}) {
  return (
    <svg className={`size-28 ${className}`} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M12 21.5a9.5 9.5 0 1 0 0-19a9.5 9.5 0 0 0 0 19"/><path d="M9 14.433a2.82 2.82 0 0 0 3 2.57c2.42 0 3-1.39 3-2.57s-1-2.43-3-2.43s-3-.79-3-2.4a2.75 2.75 0 0 1 3-2.6a2.89 2.89 0 0 1 3 2.6M12 18.5v-1.3m0-11.7v1.499"/></g></svg>
  )
}
export function IconEqual({className = ''}) {
  return (
    <svg className={`size-6 ${className}`} xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 448 512"><path fill="black" d="M416 304H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32m0-192H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32"/></svg>
  )
}
export function IconArrowRight({className = ''}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} width="30" height="30" viewBox="0 0 24 24"><path fill="white" d="m23.068 11.993l-4.25-4.236l-1.412 1.417l1.835 1.83L.932 11v2l18.305.002l-1.821 1.828l1.416 1.412z"/></svg>
  )
}
export function IconArrowCircleRight({className = ''}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} width="24" height="24" viewBox="0 0 24 24"><path fill="black" d="M12 15.289L15.288 12L12 8.711l-.688.689l2.1 2.1H8.5v1h4.912l-2.1 2.1zM12.003 21q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/></svg>
  )
}
export function IconCow({className = ''}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className}`}  width="24" height="24" viewBox="0 0 256 256"><path fill="#000" d="M104 192a8 8 0 0 1-8 8H80a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8m72-8h-16a8 8 0 0 0 0 16h16a8 8 0 0 0 0-16m68.39-61.88A16 16 0 0 1 232 128h-32v32a40 40 0 0 1-24 72H80a40 40 0 0 1-24-72v-32H24a16 16 0 0 1-15.69-19a56.13 56.13 0 0 1 54.91-45h1.64A55.83 55.83 0 0 1 48 24a8 8 0 0 1 16 0a40 40 0 0 0 40 40h48a40 40 0 0 0 40-40a8 8 0 0 1 16 0a55.83 55.83 0 0 1-16.86 40h1.64a56.13 56.13 0 0 1 54.91 45a15.82 15.82 0 0 1-3.3 13.12M144 124a12 12 0 1 0 12-12a12 12 0 0 0-12 12m-56 0a12 12 0 1 0 12-12a12 12 0 0 0-12 12m-32-12v-8a39.8 39.8 0 0 1 8-24h-.8A40.09 40.09 0 0 0 24 112Zm144 80a24 24 0 0 0-24-24H80a24 24 0 0 0 0 48h96a24 24 0 0 0 24-24m32-80a40.08 40.08 0 0 0-39.2-32h-.8a39.8 39.8 0 0 1 8 24v8Z"/></svg>
  )
}
