module.exports = function(grunt) {
  var os = require('os');

  const DARWIN = Boolean(os.platform().indexOf('darwin') > -1);
  if (DARWIN) {
    var options = {
      scope: [
        'devDependencies',
        'dependencies'
      ]
    };
    var platforms = ['osx64'];
    var distParams = ['clean:dist', 'nwjs', 'appdmg', 'compress:osx64'];
  }
  else {
    var options = {
      scope: [
        'devDependencies'
      ]
    };
    var platforms = ['linux32', 'linux64', 'win32', 'win64', 'osx64'];
    var distParams = ['clean:dist', 'nwjs', 'compress'];
  }

  require('load-grunt-tasks')(grunt, options);

  // Project configuration.
  grunt.initConfig({

    useminPrepare: {
         html: 'app/index.html',
         options: {
             dest: 'dist'
         }
     },

     copy: {
	    dist: {
        files: [
          {
            expand: true,
            cwd: 'app',
            dest: 'dist',
            src: [
              'index.html',
              'package.json',
              'resources/**',
              'node_modules/**',
              'views/{,*/}*.html'
            ]
          },
          {
            expand: true,
            cwd: 'app/bower_components/bootstrap/fonts',
            dest: 'dist/fonts/',
            src: '*.*'
          }
        ]
	    }
    },

    usemin:{
	  	html:['dist/index.html']
    },

    pkg: grunt.file.readJSON('package.json'),
    wiredep: {
      task: {
        directory: 'app/bower_components',
        bowerJson: grunt.file.readJSON('app/bower.json'),
        src: ['index.html']
      }
    },
    exec: {
      nw: 'node_modules/nw/bin/nw dist',
      stop_NW: 'killall nw || killall nwjs || true'
    },
    nwjs: {
      options: {
        version: '0.12.3',
        buildDir: 'dist/',
        winIco: 'doc/images/icestudio-logo.ico',
        macIcns: 'doc/images/icestudio-logo.icns',
        macPlist: { 'CFBundleIconFile': 'app.icns' },
        platforms: platforms
      },
      src: ['app/**']
    },
    appdmg: {
      options: {
        basepath: '.',
        title: 'Icestudio Installer',
        icon: 'doc/images/icestudio-logo.icns',
        background: 'doc/images/installer-background.png',
        window: {
          size: {
            width: 512,
            height: 385,
          }
        },
        contents: [
          {
            x: 345,
            y: 250,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 170,
            y: 250,
            type: 'file',
            path: 'dist/Icestudio/osx64/Icestudio.app'
          }
        ]
      },
      target: {
        dest: 'dist/<%=pkg.name%>-<%=pkg.version%>-osx64.dmg'
      }
    },
    compress: {
      linux32: {
        options: {
          archive: 'dist/<%=pkg.name%>-<%=pkg.version%>-linux32.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/Icestudio/linux32/',
          src: ['Icestudio', 'icudtl.dat', 'nw.pak', '*.so'],
          dest: ''
        }]
      },
      linux64: {
        options: {
          archive: 'dist/<%=pkg.name%>-<%=pkg.version%>-linux64.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/Icestudio/linux64/',
          src: ['Icestudio', 'icudtl.dat', 'nw.pak', '*.so'],
          dest: '.'
        }]
      },
      win32: {
        options: {
          archive: 'dist/<%=pkg.name%>-<%=pkg.version%>-win32.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/Icestudio/win32/',
          src: ['Icestudio.exe', 'icudtl.dat', 'nw.pak', '*.dll'],
          dest: '.'
        }]
      },
      win64: {
        options: {
          archive: 'dist/<%=pkg.name%>-<%=pkg.version%>-win64.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/Icestudio/win64/',
          src: ['Icestudio.exe', 'icudtl.dat', 'nw.pak', '*.dll'],
          dest: '.'
        }]
      },
      osx64: {
        options: {
          archive: 'dist/<%=pkg.name%>-<%=pkg.version%>-osx64.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/Icestudio/osx64/',
          src: ['Icestudio.app/**'],
          dest: '.'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['app/resources/**/*.*',
                'app/scripts/**/*.*',
                'app/styles/**/*.*',
                'app/views/**/*.*',
                'app/*.*',
                '!app/a.out',
                '!app/_build'],
        tasks: ['wiredep', 'exec:stop_NW', 'exec:nw'],
        options: {
          atBegin: true,
          interrupt: true
        }
      }
    },
    clean: {
      dist: ['dist', '.tmp'],
      // node: ['node_modules'],
      // appnode: ['app/node_modules'],
      // appbower: ['app/bower_components'],
      // cache: ['cache']
    }
  });

  // Default tasks.
  grunt.registerTask('default', function() {
    console.log('Icestudio');
  });
  grunt.registerTask('serve', [
    'watch:scripts'
  ]);
  grunt.registerTask('dist', [
    'clean:dist',
    'copy:dist',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'usemin'
  ]);
};
