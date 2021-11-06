# Odorik.cz API unofficial SDK

[Czech]

Neoficiální Node.js SDK pro [API Voip operátora Odorik](http://www.odorik.cz/w/api).

### Instalace

```shell
npm i odorik
```

### Použití

```js
import Odorik from 'odorik'

// autorizace
const Odo = new Odorik('USER', 'PASSWORD')

// nebo autorizace pomocí ENV
// ODORIK_USER=XXXX
// ODORIK_PASSWORD=YYYYYYY
const Odo = new Odorik()

// zpětné zavolání
await Odo.callback(moje_cislo, cislo_volaneho)

// výpis hovorů
await Odo.getCalls({
  from, // datum od
  to, // datum do
  since_id, // od posl. id
  ...
})

// výpis zmeškaných hovorů
await Odo.getMissedCalls({
  from, // datum od
  to, // datum do
  since_id, // od posl. id
  ...
})

// výpis aktivních hovorů
await Odo.getActiveCalls()

// zavěsit
await Odo.hangUp(id_aktivniho_hovoru)

// poslat SMS
await Odo.sendSMS({
  recipient, // číslo příjemce 
  message, // text zprávy - diakritika bude odstraněna
  ...
})

// zůstatek kreditu
await Odo.getBalance()
```

...a další funkce, které se mi teď neche vypisovat.