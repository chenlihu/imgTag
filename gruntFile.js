module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            src: ["client/app/*.js"]
        },
        uglify: {
            options: {
                mangle: false,
                beautify: true
            },
            publish: {
                files: {
                    "client/build/controllers.js": ["client/app/controllers/*.js", "client/app/services/*.js"]
                }
            }
        },
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'app.js'
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'client/assets/sass',
                    cssDir: 'client/assets/css',
                    outputStyle:'expanded'
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: true,
                    reload: true
                },
                files: ['client/**/*.html', 'client/app/**/*.js', 'client/assets/css/*.css']
            },
            express: {
                files: ['app.js', 'service/*.js', 'service/**/*.js'],//监控express服务端代码。如有变更则重启服务器
                tasks: ['express:dev'],
                options: {
                    nospawn: true,
                    atBegin: true
                }
            },
            concat: {
                files: ["client/app/controllers/**/*.js", "client/app/services/*.js", "client/app/filters/*.js"],
                tasks: ["concat"]
            },
            compass:{
                files: ['client/assets/sass/*.scss'],
                tasks:['compass:dist']
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ["client/app/controllers/**/*.js", "client/app/services/*.js", "client/app/filters/*.js"],
                dest: 'client/build/controllers.js',
            },
        },
        copy: {
            main: {
                files: [{ expand: true, cwd: 'server/', src: 'api/**', dest: 'dest/', filter: 'isFile' },
                    { expand: true, cwd: 'server/', src: 'utils/**', dest: 'dest/', filter: 'isFile' },
                    { expand: true, cwd: 'server/', src: ['config.db.js', 'config.js', 'config.publisher.router.js', 'db.js'], dest: 'dest/', filter: 'isFile' }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    //文件合并
    grunt.loadNpmTasks('grunt-contrib-concat');
    //代码检查
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //文件监视
    grunt.loadNpmTasks('grunt-contrib-watch');
    //文件压缩
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //用于express服务重启
    grunt.loadNpmTasks('grunt-express-server');
    //加载compass插件
    grunt.loadNpmTasks('grunt-contrib-compass');

};
