import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

old_bundle_div = r'''                             <div key=\{bundle\.id\} \n                                 className=\{`p-4 border rounded-xl flex flex-col items-center justify-between relative overflow-hidden group transition-all`\}\n                                 style=\{\{ borderColor: bundle\.color, boxShadow: `0 0 15px \$\{bundle\.glow\}`, backgroundImage: `url\('/inappbundlebackground\.png'\)`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' \}\}>\n                                 <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style=\{\{ backgroundColor: bundle\.color \}\} />'''

new_bundle_div = '''                             <div key={bundle.id} \n                                 className={`p-6 flex flex-col items-center justify-between relative group transition-all`}\n                                 style={{ backgroundImage: `url('/inappbundlebackground.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '180px' }}>\n                                 <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: bundle.color }} />'''

text = re.sub(old_bundle_div, new_bundle_div, text)
with open('src/App.tsx', 'w') as f:
    f.write(text)
