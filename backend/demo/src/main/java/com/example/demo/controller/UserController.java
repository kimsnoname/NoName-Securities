package com.example.demo.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Hex;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.AuthenticationRequest;
import com.example.demo.dto.AuthenticationResponse;
import com.example.demo.model.User;
import com.example.demo.model.UserAccount;
import com.example.demo.model.UserCreateForm;
import com.example.demo.model.UserKey;
import com.example.demo.model.UserPoint;
import com.example.demo.model.UserPortfolio;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ImageService;
import com.example.demo.service.JwtService;
import com.example.demo.service.UserPortfolioService;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.example.demo.repository.UserKeyRepository;
import com.example.demo.repository.UserPointRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.example.demo.repository.UserAccountRepository;

@RestController
@CrossOrigin(origins = {"http://www.nonamestock.com:8080"})
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private static final String CURRENT_VERSION = "1.0.1";
    private static final String APK_FILE_PATH = "./update.apk"; // APK 파일 경로

    private final UserService userService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserPortfolioService userPortfolioService;

    private final UserKeyRepository userKeyRepository;
    private final UserPointRepository userPointRepository;
    private final ImageService imageService;
    private final UserAccountRepository userAccountRepository;
    
    @PostMapping("/register")
    public ResponseEntity<Object> saveUser(@RequestBody @Valid UserCreateForm userCreateForm) {
        User user = userService.create(userCreateForm.getEmail(), userCreateForm.getUserName(), userCreateForm.getPw());
        
        // 대칭키 생성
        String key = KeyGenerators.string().generateKey();
        
        // UserKey 저장
        UserKey userKey = new UserKey();
        userKey.setUserId(user.getUser_id().intValue());  // Long을 Integer로 변환
        userKey.setUserKey(key);  // setKey() 대신 setUserKey() 사용
        userKeyRepository.save(userKey);
        
        // UserPoint 초기화
        UserPoint userPoint = new UserPoint();
        userPoint.setUserId(user.getUser_id().intValue());  // Long을 Integer로 변환
        userPoint.setPoint(0);
        userPointRepository.save(userPoint);
        
        // 클라이언트에 userId와 key 반환
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getUser_id());
        response.put("key", key);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/register")
    public ResponseEntity<List<User>> getAllTestEntities() {
        List<User> result = userService.getAllTestEntities();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(userService.authenticate(request));
    }

    @GetMapping("/hello")
    public ResponseEntity<Object> testApi() {
        String result = "API 통신에 성공하였습니다.";
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/image")
    public String getImage(@RequestParam String imageUrl) {
        return imageService.getImageAsBase64(imageUrl);
    }

    @PostMapping("/check-email")
    public ResponseEntity<Void> checkEmail(@RequestBody Map<String, String> email) {
        if (userService.isEmailExists(email.get("email"))) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/check-username")
    public ResponseEntity<Void> checkUserName(@RequestBody Map<String, String> userName) {
        if (userService.isUsernameExists(userName.get("userName"))) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String userEmail = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
        
        UserPoint userPoint = userPointRepository.findById(user.getUser_id().intValue())
                .orElseThrow(() -> new RuntimeException("User point not found for userId: " + user.getUser_id()));

        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("userName", user.getUserName());
        response.put("point", userPoint.getPoint());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stock/{stockCode}")
    public ResponseEntity<?> getUserStockQuantity(
            @PathVariable String stockCode,
            @RequestHeader("Authorization") String token) {

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String userEmail = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        Optional<UserPortfolio> userPortfolio = userPortfolioService.getUserPortfolio(user.getUser_id(), stockCode);

        if (userPortfolio.isPresent()) {
            return ResponseEntity.ok(userPortfolio.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/updateCheck")
    public ResponseEntity<Map<String, Object>> updateCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("currentVersion", CURRENT_VERSION); // 서버의 최신 버전 정보를 응답에 포함
        return ResponseEntity.ok(response);
    }

    @GetMapping("/updateApk")
    public ResponseEntity<Resource> updateApk() {
        File apkFile = new File(APK_FILE_PATH);
        System.out.println("APK File Path: " + apkFile.getAbsolutePath()); // 파일 경로 출력

        if (apkFile.exists()) {
            try {
                InputStreamResource resource = new InputStreamResource(new FileInputStream(apkFile));
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + apkFile.getName())
                        .header(HttpHeaders.CONTENT_TYPE, "application/vnd.android.package-archive")
                        .contentLength(apkFile.length())
                        .body(resource);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            System.out.println("APK File Not Found: " + apkFile.getAbsolutePath()); // 파일이 없다는 로그
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 이메일로 userId 가져오기
    @GetMapping("/getUserIdByEmail")
    public ResponseEntity<Map<String, Object>> getUserIdByEmail(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.get().getUser_id());
            response.put("success", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User not found");
            response.put("success", false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    // username으로 userId 가져오기
    @GetMapping("/getUserIdByUsername")
    public ResponseEntity<Map<String, Object>> getUserIdByUsername(@RequestParam String username) {
        Optional<User> user = userRepository.findByUserName(username);
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.get().getUser_id());
            response.put("success", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User not found");
            response.put("success", false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getUserKeyByUserId")
    public ResponseEntity<Map<String, Object>> getUserKeyByUserId(@RequestParam Long userId) {
        Optional<UserKey> userKey = userKeyRepository.findById(userId.intValue());
        if (userKey.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("userKey", userKey.get().getUserKey());
            response.put("success", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User key not found");
            response.put("success", false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/point")
    public ResponseEntity<String> updatePoint(@RequestBody Map<String, String> request) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // 클라이언트로부터 userId와 암호화된 데이터 받기
            Integer userId = Integer.parseInt(request.get("userId"));
            String encryptedData = request.get("encryptedData");

            // userId에 해당하는 user_key 조회
            UserKey userKey = userKeyRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User key not found for userId: " + userId));

            String key = userKey.getUserKey();

            // AES 복호화
            String decryptedData = decrypt(encryptedData, key);

            // JSON 파싱
            JsonNode jsonNode = mapper.readTree(decryptedData);
            int pointToAdd = jsonNode.get("point").asInt();

            // UserPoint 업데이트 쿼리 실행
            int rowsUpdated = userPointRepository.updateUserPoints(userId, pointToAdd);
            if (rowsUpdated == 0) {
                throw new RuntimeException("User point not found for userId: " + userId);
            }

            // 응답 생성
            ObjectNode responseJson = mapper.createObjectNode();
            responseJson.put("state", true);

            // 응답 암호화
            String encryptedResponse = encrypt(mapper.writeValueAsString(responseJson), key);

            return ResponseEntity.ok(encryptedResponse);
        } catch (Exception e) {
            e.printStackTrace();
            // 응답 생성
            ObjectNode responseJson = mapper.createObjectNode();
            responseJson.put("state", false);

            // userId에 해당하는 user_key 조회
            try {
                Integer userId = Integer.parseInt(request.get("userId"));
                UserKey userKey = userKeyRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User key not found for userId: " + userId));

                String key = userKey.getUserKey();
                // 응답 암호화
                String encryptedResponse = encrypt(mapper.writeValueAsString(responseJson), key);

                return ResponseEntity.ok(encryptedResponse);
            } catch (Exception innerException) {
                innerException.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
    }

    private String decrypt(String encryptedHex, String key) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decryptedBytes = cipher.doFinal(Hex.decodeHex(encryptedHex));
        return new String(decryptedBytes);
    }

    private String encrypt(String data, String key) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encryptedBytes = cipher.doFinal(data.getBytes());
        return Hex.encodeHexString(encryptedBytes);
    }

    @PostMapping("/pointTocash")
    public ResponseEntity<String> pointToCash(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
        }

        try {
            // 이메일로 유저 찾기
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            System.out.println("User found: " + user);

            // 유저 ID로 포인트 정보 찾기
            UserPoint userPoint = userPointRepository.findByUserId(user.getUser_id().intValue())
                .orElseThrow(() -> new RuntimeException("User point not found for userId: " + user.getUser_id()));
            System.out.println("User point found: " + userPoint);

            // 유저 ID로 유저 계정 정보 찾기
            UserAccount userAccount = userAccountRepository.findByUserId(user.getUser_id())
                .orElseThrow(() -> new RuntimeException("User account not found for userId: " + user.getUser_id()));
            System.out.println("User account found: " + userAccount);

            // 포인트를 현금으로 변환하여 계정에 추가하고, 포인트를 0으로 설정
            int pointsToCash = userPoint.getPoint();
            userAccount.setBalance(userAccount.getBalance() + pointsToCash);
            userPoint.setPoint(0);

            // 변경사항 저장
            userAccountRepository.save(userAccount);
            userPointRepository.save(userPoint);
            System.out.println("Points converted and saved successfully");

            return new ResponseEntity<>("Points converted to cash successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/checkpoint")
    public ResponseEntity<String> checkpoint(@RequestBody Map<String, Long> request) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // 클라이언트로부터 userId 받기
            Long userId = request.get("userId");

            // userId에 해당하는 user_key 조회
            UserKey userKey = userKeyRepository.findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User key not found for userId: " + userId));

            String key = userKey.getUserKey();

            // userId에 해당하는 ischeck 값 조회
            Optional<UserPoint> userPointOptional = userPointRepository.findById(userId.intValue());
            if (userPointOptional.isEmpty()) {
                throw new RuntimeException("UserPoint not found for userId: " + userId);
            }

            UserPoint userPoint = userPointOptional.get();
            boolean state = Boolean.TRUE.equals(userPoint.getIscheck());

            // 응답 생성
            ObjectNode responseJson = mapper.createObjectNode();
            responseJson.put("state", state);

            // 응답 암호화
            String encryptedResponse = encrypt(mapper.writeValueAsString(responseJson), key);

            // 응답을 보낸 후 ischeck 값을 true로 변경
            if (!state) {
                userPoint.setIscheck(true);
                userPointRepository.save(userPoint);
            }

            return ResponseEntity.ok(encryptedResponse);
        } catch (Exception e) {
            e.printStackTrace();
            // 오류 발생 시 응답 생성
            ObjectNode responseJson = mapper.createObjectNode();
            responseJson.put("state", "false");

            try {
                Long userId = request.get("userId");
                UserKey userKey = userKeyRepository.findById(userId.intValue())
                    .orElseThrow(() -> new RuntimeException("User key not found for userId: " + userId));

                String key = userKey.getUserKey();
                // 응답 암호화
                String encryptedResponse = encrypt(mapper.writeValueAsString(responseJson), key);

                return ResponseEntity.ok(encryptedResponse);
            } catch (Exception innerException) {
                innerException.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
    }
}
