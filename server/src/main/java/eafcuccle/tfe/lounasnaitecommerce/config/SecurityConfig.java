package eafcuccle.tfe.lounasnaitecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(this.jwkSetUri).build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new JwtGrantedAuthoritiesConverter());

        http
                .authorizeRequests(requests -> requests

                        .requestMatchers("/api/categories").permitAll()
                        .requestMatchers("/api/images").permitAll()
                        .requestMatchers("/api/instruments").permitAll()
                        .requestMatchers("/api/instruments/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clients").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admins").permitAll()
                        .requestMatchers("/api/aviss").permitAll()
                        .requestMatchers("/api/paiements").permitAll()
                        .requestMatchers("/api/factures").permitAll()
                        .requestMatchers("/api/modesPaiement").permitAll()

                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter)))
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
